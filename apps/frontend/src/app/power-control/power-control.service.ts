import { effect, Injectable, signal, WritableSignal } from "@angular/core";

import { CloakGateway } from "../infrastructure/cloak.gateway";
import { PowerControlRpcAdapter } from "./rpc/power-control.rpc.adapter";
import { MatrixService } from "../common/matrix/matrix.service";

@Injectable({
  providedIn: "root"
})
export class PowerControlService {

  powerInit = effect(async () => {
    if (this.gateway.isConnected()) {
      const power = await this.rpc.getPhasePower();
      this.matrix.phasePower.set(power);
    }
  });

  constructor(
    public readonly matrix: MatrixService,
    private readonly gateway: CloakGateway,
    private readonly rpc: PowerControlRpcAdapter
  ) { }

  public async updatePhasePower(newPower: number[]) {
    this.matrix.phasePower.set(newPower);
  }
}
