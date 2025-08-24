import { inject } from "@angular/core";
import { Request } from "@phobos-cloak/protocol";

import { Subscription } from "rxjs";
import { CloakGateway } from "../cloak.gateway";


export class CloakRequestHandler {
  protected gateway: CloakGateway = inject(CloakGateway);

  private onRequestSubscription?: Subscription;

  constructor() {
    this.onRequestSubscription = this.gateway.onRequest.subscribe(this.handleRequest.bind(this));
  }

  protected async handleRequest(e: { id: string, request: Request }) {
    const method = Object.keys(e.request).find(key => (e.request as any)[key] !== undefined);

    if (method) {
      const args = (e.request as any)[method] as any
      if (typeof (this as any)[method] === 'function') {
        const res = await (this as any)[method](args);
        this.gateway.respond(e.id, res);
      }
    }
  }
}