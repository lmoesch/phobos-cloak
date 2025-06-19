import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from "rxjs";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { PhobosMessage, Response, Request } from "../../../proto/phobos";

const PHOBOS_CLOAK_SERVER_HOSTNAME = window?.__env?.phobosCloakServerHostname != null ? `${window.__env.phobosCloakServerHostname}` : window.location.hostname;
const PHOBOS_CLOAK_SERVER_PORT = window?.__env?.phobosCloakServerPort != null ? window.__env.phobosCloakServerPort : window.location.port;

const REST_API_URL = `http://${window.location.host}`;
const WS_URL = `ws://${PHOBOS_CLOAK_SERVER_HOSTNAME}:${PHOBOS_CLOAK_SERVER_PORT}`;

@Injectable()
export class PhobosBackendService {
    public onRequest: Subject<{id: string, request: Request}> = new Subject<{id: string, request: Request}>();
    public onMessage: Subject<PhobosMessage> = new Subject<PhobosMessage>();
    public onOpen: Subject<void> = new Subject<void>();
    public onClose: Subject<void> = new Subject<void>();

    public isConnected: boolean = false;

    private requests: Map<string, (value: Response) => void> = new Map<string, (value: Response) => void>();
    private ws!: WebSocketSubject<any>;

    constructor(private http: HttpClient) {}

    public async connect() {
        this.ws = webSocket({url: WS_URL, openObserver: { next: () => { this.isConnected = true; this.onOpen.next()} }});
        console.log('Connecting to', WS_URL);
        this.ws.subscribe({
            next: this.handleMessage.bind(this),
            error: this.handleClose.bind(this),
            complete: this.handleClose.bind(this)
        });
    }

    public request(req: Request): Promise<Response> {
        return new Promise((resolve, reject) => {
            const msg: PhobosMessage = {
                id: uuidv4(),
                request: req
            }
            this.requests.set(msg.id, resolve.bind(this));
            setTimeout(this.rejectOnTimeout.bind(this, msg.id, reject.bind(this, `${req} timed out`)), 5000);
            this.ws.next({event: 'msg', data: JSON.stringify(PhobosMessage.toJSON(msg))});
        });

    }

    public respond(id: string, res: Response) {
        const msg: PhobosMessage = {
            id: id,
            response: res
        }
        this.ws.next({event: 'msg', data: JSON.stringify(PhobosMessage.toJSON(msg))});
    }

    private handleMessage(buffer: {event: 'msg', data: string}) {
        const msg = PhobosMessage.fromJSON(JSON.parse(buffer.data));
        if(msg.request) {
            this.onRequest.next({id: msg.id, request: msg.request});
        }

        if(msg.response) {
            if(this.requests.has(msg.id)) {
                this.requests.get(msg.id)!(msg.response);
                this.requests.delete(msg.id);
            }
        }

        this.onMessage.next(msg);
    }

    private handleClose() {
        this.isConnected = false;
        setTimeout(this.connect.bind(this), 5000);
        this.onClose.next();
    }

    private rejectOnTimeout(id: string, reject: (reason?: any) => void) {
        if(this.requests.delete(id)) {
            reject();
        };
    }
}
