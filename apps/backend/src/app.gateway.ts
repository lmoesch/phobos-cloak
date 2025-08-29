import * as WebSocket from 'ws';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { v4 as uuidv4 } from 'uuid';

import { LoggingService } from 'src/core/logging/logging.service';
import { Subject } from 'rxjs';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './common/guards/auth.guard';
import { Ws } from './common/interfaces/ws';
import { PhobosMessage, Request, Response } from 'proto/phobos';

@WebSocketGateway({path: '/api'})
export class AppGateway {
  protected activeClients: Map<string, Ws> = new Map<string, Ws>();
  protected requests: Map<string, (value: Response) => void> = new Map<string, (value: Response) => void>();

  public onMessage: Subject<PhobosMessage> = new Subject<PhobosMessage>();
  public onRequest: Subject<{client: Ws, msgId: string, request: Request}> = new Subject<{client: Ws, msgId: string, request: Request}>();

  constructor(private readonly log: LoggingService, private readonly jwtService: JwtService) {

  }

  @WebSocketServer() server: WebSocket.Server;

  // @UseGuards(AuthGuard)
  @SubscribeMessage('msg')
  public handleMessage(client: Ws, payload: string): void {
    const msg = PhobosMessage.fromJSON(JSON.parse(payload));

    if(msg.request) {
        this.onRequest.next({client: client, msgId: msg.id, request: msg.request});
    }

    if(msg.response) {
        if(this.requests.has(msg.id)) {
            this.requests.get(msg.id)!(msg.response);
            this.requests.delete(msg.id);
        }
    }
    this.onMessage.next(msg);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('token')
  public handleToken(client: Ws, payload: string): void {
    client.token = payload;
  }

  handleDisconnect(client: Ws) {
    this.activeClients.delete(client.id);
    this.log.info(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Ws, ...args: any[]) {
    const urlParams = new URLSearchParams(args[0].url.split('?')[1]);

    client.token = urlParams.get('token');
    client.id = uuidv4();
    
    this.activeClients.set(client.id, client);
    this.log.info(`Client connected: ${client.id}`);
  }

  public async request(clientId: string, req: Request): Promise<Response> {
    return new Promise((resolve, reject) => {
        const msg: PhobosMessage = {
            id: uuidv4(),
            request: req
      }

      this.requests.set(msg.id, resolve.bind(this));
      setTimeout(this.rejectOnTimeout.bind(this, msg.id, reject), 5000);
      this.sendToClient(this.activeClients.get(clientId), msg);
    });
  }

  public async requestAll(req: Request) {
    const requests: Promise<Response>[] = [];
    for (const [id, activeClient] of this.activeClients) {
      requests.push(this.request(activeClient.id, req))
    }

    return Promise.allSettled(requests);
  }

  public async requestAllButOne(clientId: string, req: Request) {
    const requests: Promise<Response>[] = [];
    for (const [id, activeClient] of this.activeClients) {
      if (activeClient.id != clientId) {
        requests.push(this.request(activeClient.id, req))
      }
    }

    return Promise.allSettled(requests);
  }

  public respond(clientId: string, msgId: string, res: Response) {
    const msg: PhobosMessage = {
        id: msgId,
        response: res
    }
    this.sendToClient(this.activeClients.get(clientId), msg);
  }

  public error(clientId: string, msgId: string, err: Error) {
    const msg: PhobosMessage = {
        id: msgId,
        error: {type: err.name, message: err.message}
    }
    this.sendToClient(this.activeClients.get(clientId), msg);
  }

  protected rejectOnTimeout(id: string, reject: (reason?: any) => void) {
    if(this.requests.delete(id)) {
        reject();
    }
  }

  protected sendToAllClients(msg: PhobosMessage) {
    for (const [id, client] of this.activeClients) {
      this.sendToClient(client, msg);
    }
  }

  protected sendToClient(client: Ws, msg: PhobosMessage) {
    const buffer = {event: 'msg', data: JSON.stringify(PhobosMessage.toJSON(msg))};
    client.send(JSON.stringify(buffer))
  }
}
