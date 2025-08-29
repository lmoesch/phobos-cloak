import { Injectable } from "@angular/core";
import { Request, SetClusterMixingMatrix_Request, SetPhasePower_Request, SetTargetClusterMixingMatrix_Request, SetTargetPhasePower_Request } from "@phobos-cloak/protocol";

import { CloakRequestHandler } from "../../../infrastructure/rpc/cloak-request-handler.base";
import { MatrixService } from "../matrix.service";

@Injectable({
  providedIn: "root",
})
export class MatrixApiService extends CloakRequestHandler{
  constructor(
    private readonly service: MatrixService
  ) {
    super();
  }

  private async setClusterMixingMatrix(request: SetClusterMixingMatrix_Request): Promise<void> {
    const matrix = request.matrix;
    this.service.mixingMatrix.set(matrix);
  }

  private async setPhasePower(request: SetPhasePower_Request): Promise<void> {
    const power = request.power;
    this.service.phasePower.set(power);
  }

  private async setTargetClusterMixingMatrix(request: SetTargetClusterMixingMatrix_Request): Promise<void> {
    const matrix = request.matrix;
    this.service.targetMixingMatrix.set(matrix);
  }

  private async setTargetPhasePower(request: SetTargetPhasePower_Request): Promise<void> {
    const power = request.power;
    this.service.targetPhasePower.set(power);
  }
}