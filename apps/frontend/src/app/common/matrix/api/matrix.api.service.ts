import { Injectable } from "@angular/core";
import { Request, SetClusterMixingMatrix_Request } from "@phobos-cloak/protocol";

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
}