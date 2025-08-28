import { Injectable } from "@angular/core";
import { GetClusterMixingMatrix_Response, GetPhasePower_Response, GetTargetPhasePower_Response, Request } from "@phobos-cloak/protocol"; 

import { CloakGateway } from "../../../infrastructure/cloak.gateway";

@Injectable({
  providedIn: "root",
})
export class MatrixRpcAdapter {
  constructor(
    private readonly gateway: CloakGateway  
  ) {}

  public async getClusterMixingMatrix(): Promise<number[]> {
    const request: Request = {
      getClusterMixingMatrix: {}
    }
    const response = (await this.gateway.request(request)).getClusterMixingMatrix as GetClusterMixingMatrix_Response;
    return response.matrix;
  }

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

  public async getTargetClusterMixingMatrix(): Promise<number[]> {
    const request: Request = {
      getTargetClusterMixingMatrix: {}
    }
    const response = (await this.gateway.request(request)).getTargetClusterMixingMatrix as GetClusterMixingMatrix_Response;
    return response.matrix;
  }

  public async setClusterMixingMatrix(matrix: number[]): Promise<void> {
    const request: Request = {
      setClusterMixingMatrix: {
        matrix
      }
    }
    await this.gateway.request(request);
  }

  public async setTargetClusterMixingMatrix(matrix: number[]): Promise<void> {
    const request: Request = {
      setTargetClusterMixingMatrix: {
        matrix
      }
    }
    await this.gateway.request(request);
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
