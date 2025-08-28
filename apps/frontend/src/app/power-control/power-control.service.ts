import { effect, Injectable } from "@angular/core";

import { CloakGateway } from "../infrastructure/cloak.gateway";
import { MatrixService } from "../common/matrix/matrix.service";
import { MatrixRpcAdapter } from "../common/matrix/rpc/matrix.rpc.adapter";

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
    private readonly rpc: MatrixRpcAdapter
  ) { }

  public async updatePhasePower(newPower: number[]) {
    this.matrix.phasePower.set(newPower);
  }
}
