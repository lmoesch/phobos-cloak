import { Injectable } from "@angular/core";
import { GetPhasePower_Response, GetTargetPhasePower_Response, Request } from "@phobos-cloak/protocol";

import { CloakGateway } from "../../infrastructure/cloak.gateway";

@Injectable({
  providedIn: "root"
})
export class PowerControlRpcAdapter {
  constructor(
    private gateway: CloakGateway
  ) {}

  public async getPhasePower(): Promise<number[]> {
    const request: Request = {
      getPhasePower: {}
    }
    const response = (await this.gateway.request(request)).getPhasePower as GetPhasePower_Response;
    return response.power;
  }

  public async getTargetPhasePower(): Promise<number[]> {
    const request: Request = {
      getTargetPhasePower: {}
    }
    const response = (await this.gateway.request(request)).getTargetPhasePower as GetTargetPhasePower_Response;
    return response.power;
  }

  public async setPhasePower(power: number[]) {
    const request: Request = {
      setPhasePower: { power }
    }
    await this.gateway.request(request);
  }

  public async setTargetPhasePower(power: number[]) {
    const request: Request = {
      setTargetPhasePower: { power }
    }
    await this.gateway.request(request);
  }

}
