import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhSliderVertical } from '@phobos/elements';

import { PhobosBackendService } from '../../backend/phobos.backend.service';

@Component({
  selector: 'ph-cloak-cluster-matrix',
  imports: [
    PhSliderVertical
  ],
  templateUrl: './cluster-matrix.component.html',
  styleUrl: './cluster-matrix.component.scss'
})
export class ClusterMatrixComponent {

  @Input() matrix: number[] = [0.166, 0.166, 0.166, 0.166, 0.166, 0.166];
  @Output() matrixChange: EventEmitter<number[]> = new EventEmitter<number[]>();

  constructor(private readonly phobos: PhobosBackendService) { }
  
  ngAfterViewInit() {
    this.phobos.onOpen.subscribe(async () => {
      const matrix = (await this.phobos.request({getClusterMixingMatrix: {}})).getClusterMixingMatrix?.matrix;
      this.matrix = matrix!;
    });

    this.phobos.onRequest.subscribe(async (request) => {
      if (request.request.setClusterMixingMatrix) {
        this.matrix = request.request.setClusterMixingMatrix.matrix;
      }
    });
  }

  onSliderValueChange(index: number, value: number) {
    this.matrix[index] = value / 100;
    const sum = this.matrix.reduce((a, b, currentIndex) => a + b, 0);
    const diff = sum - (value / 100);
    const remainder = 1 - (value / 100);

    let weight = remainder / diff;
    if (isNaN(weight)) {
      weight = 0;
    } else if (! isFinite(weight)) {
      weight = 1;
    }

    this.matrix = this.matrix.map((currentValue, currentIndex) => currentIndex === index ? value / 100 : currentValue * weight);
    this.matrixChange.emit(this.matrix);
  }
}
