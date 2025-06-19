import { Rpc, RpcHandler } from "lib/decorators";
import { GetClusterMixingMatrix_Request, GetClusterMixingMatrix_Response, GetPhasePower_Request, GetPhasePower_Response, SetClusterMixingMatrix_Request, SetPhasePower_Request } from "proto/phobos.cloak";
import { AppGateway } from "src/app.gateway";
import { Ws } from "src/common/interfaces/ws";

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

@RpcHandler(AppGateway)
export class PhobosApiController { 
    public clusterMixingMatrix: number[] = [0.166, 0.166, 0.166, 0.166, 0.166, 0.166];
    public phasePower: number[] = [10.0, 10.0, 10.0, 10.0, 10.0, 10.0];

    public targetClusterMixingMatrix: number[] = [0.166, 0.166, 0.166, 0.166, 0.166, 0.166];
    public targetPhasePower: number[] = [10.0, 10.0, 10.0, 10.0, 10.0, 10.0];


    constructor(
        private readonly gateway: AppGateway
    ) {
        this.randomizeTargetValues();
        
        setInterval(() => {
            this.randomizeTargetValues();
        }, 1000 * 60 * 60);
    }

    @Rpc()
    public async setClusterMixingMatrix(client: Ws, req: SetClusterMixingMatrix_Request) {
        this.clusterMixingMatrix = req.matrix;
        this.gateway.requestAllButOne(client.id, { setClusterMixingMatrix: req }).then().catch(console.error);
    }

    @Rpc()
    public async getClusterMixingMatrix(client: Ws, req: GetClusterMixingMatrix_Request): Promise<GetClusterMixingMatrix_Response> {
        return { matrix: this.clusterMixingMatrix };
    }

    @Rpc()
    public async setPhasePower(client: Ws, req: SetPhasePower_Request) {
        this.phasePower = req.power;
        this.gateway.requestAllButOne(client.id, { setPhasePower: req }).then().catch(console.error);
    }

    @Rpc()
    public async getPhasePower(client: Ws, req: GetPhasePower_Request): Promise<GetPhasePower_Response> {
        return { power: this.phasePower };
    }

    @Rpc()
    public async getTargetClusterMixingMatrix(client: Ws, req: GetClusterMixingMatrix_Request): Promise<GetClusterMixingMatrix_Response> {
        return { matrix: this.targetClusterMixingMatrix };
    }

    @Rpc()
    public async getTargetPhasePower(client: Ws, req: GetPhasePower_Request): Promise<GetPhasePower_Response> {
        return { power: this.targetPhasePower };
    }

    private randomizeTargetValues() {
        const targetMatrix = this.targetClusterMixingMatrix.map(() => randomIntFromInterval(0, 100) / 100);
        const sum = targetMatrix.reduce((a, b) => a + b, 0);
        
        this.targetClusterMixingMatrix = targetMatrix.map((value) => value / sum);
        this.targetPhasePower = this.targetPhasePower.map(() => randomIntFromInterval(0, 100) );

        this.gateway.requestAll({ setTargetClusterMixingMatrix: { matrix: this.targetClusterMixingMatrix } }).then().catch(console.error);
        this.gateway.requestAll({ setTargetPhasePower: { power: this.targetPhasePower } }).then().catch(console.error);
    }
}