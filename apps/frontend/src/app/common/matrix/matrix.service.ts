import { computed, effect, Injectable, signal, WritableSignal } from "@angular/core";
import { CloakGateway } from "../../infrastructure/cloak.gateway";
import { MatrixRpcAdapter } from "./rpc/matrix.rpc.adapter";

@Injectable({
  providedIn: "root",
})
export class MatrixService {

  public data = computed(() => {
    return this.phasePower().map((phase, i) =>
      this.mixingMatrix().map((mix, j) =>
        phase * mix * 150 / 100 + this.jitter[i][j]
      )
    );
  });

  public targetData = computed(() => {
    return this.targetPhasePower().map((phase, i) =>
      this.targetMixingMatrix().map((mix, j) =>
        phase * mix * 150 / 100 + this.jitter[i][j]
      )
    );
  });

  public jitter = [
    [4, 35, 5, 34, 28, 50],
    [15, 8, 13, 27, 10, 32],
    [33, 47, 9, 10, 6, 36],
    [8, 23, 1, 24, 37, 7],
    [48, 18, 49, 20, 46, 19],
    [25, 22, 26, 29, 31, 21],
  ];

  public mixingMatrix: WritableSignal<number[]> = signal([0.16, 0.16, 0.16, 0.16, 0.16, 0.16]);
  public phasePower: WritableSignal<number[]> = signal([100, 100, 100, 100, 100, 100]);

  private targetMixingMatrix: WritableSignal<number[]> = signal([0.16, 0.16, 0.16, 0.16, 0.16, 0.16]);
  private targetPhasePower: WritableSignal<number[]> = signal([100, 100, 100, 100, 100, 100]);

  dataInit = effect(async () => {
    if (this.gateway.isConnected()) {
      this.mixingMatrix.set(await this.rpc.getClusterMixingMatrix());
      this.phasePower.set(await this.rpc.getPhasePower());
      this.targetMixingMatrix.set(await this.rpc.getTargetClusterMixingMatrix());
      this.targetPhasePower.set(await this.rpc.getTargetPhasePower());
    }
  });

  constructor(
    private readonly rpc: MatrixRpcAdapter,
    private readonly gateway: CloakGateway
  ) {}
}
