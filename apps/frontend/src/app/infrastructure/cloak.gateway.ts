import { Injectable, signal, WritableSignal } from "@angular/core";
import { CloakMessage, Request, Response } from "@phobos-cloak/protocol"

import { v4 as uuidv4 } from 'uuid';
import { Subject } from "rxjs";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const CLOAK_SERVER_HOSTNAME = window?.__env?.CLOAK_SERVER_HOSTNAME || window.location.hostname;
const CLOAK_SERVER_PORT = window?.__env?.CLOAK_SERVER_PORT || 3006;

const WS_URL = `ws://${CLOAK_SERVER_HOSTNAME}:${CLOAK_SERVER_PORT}`;

@Injectable(
    { providedIn: 'root' }
)
export class CloakGateway {
    public onRequest: Subject<{id: string, request: Request}> = new Subject<{id: string, request: Request}>();
    public onMessage: Subject<CloakMessage> = new Subject<CloakMessage>();
    public onOpen: Subject<void> = new Subject<void>();
    public onClose: Subject<void> = new Subject<void>();

    public isConnected: WritableSignal<boolean> = signal(false);

    private requests: Map<string, (value: Response) => void> = new Map<string, (value: Response) => void>();
    private ws!: WebSocketSubject<any>;

    constructor() {}

    public async connect() {
        this.ws = webSocket({url: `${WS_URL}/api`, openObserver: { 
            next: () => { 
                this.isConnected.set(true); 
                this.onOpen.next();
        }}});

        this.ws.subscribe({
            next: this.handleMessage.bind(this),
            error: this.handleClose.bind(this),
            complete: this.handleClose.bind(this)
        });
    }

    public request(req: Request): Promise<Response> {
        return new Promise((resolve, reject) => {
            const msg: CloakMessage = {
                id: uuidv4(),
                request: req
            }
            this.requests.set(msg.id, resolve.bind(this));
            setTimeout(this.rejectOnTimeout.bind(this, msg.id, reject.bind(this, `${req} timed out`)), 5000);
            this.ws.next({event: 'msg', data: JSON.stringify(CloakMessage.toJSON(msg))});
        });
    }

    public respond(id: string, res: Response) {
        const msg: CloakMessage = {
            id: id,
            response: res
        }
        this.ws.next({event: 'msg', data: JSON.stringify(CloakMessage.toJSON(msg))});
    }

    private handleMessage(buffer: {event: 'msg', data: string}) {
        const msg = CloakMessage.fromJSON(JSON.parse(buffer.data));
        
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
        this.isConnected.set(false);
        // setTimeout(this.connect.bind(this), 5000);
        this.onClose.next();
    }

    private rejectOnTimeout(id: string, reject: (reason?: any) => void) {
        if(this.requests.delete(id)) {
            reject();
        };
    }
}
