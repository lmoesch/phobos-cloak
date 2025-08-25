import { computed, Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MatrixService {
  
  public targetData = [
    [100, 100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100, 100],
  ];

  public data = computed(() => {
    return this.phasePower().map((phase, i) =>
      this.mixingMatrix().map((mix, j) =>
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

  constructor() {}
}
