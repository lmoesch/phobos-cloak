import { ChangeDetectorRef, Component } from '@angular/core';
import { PhElementsModule } from '../../../lib/phobos-elements/ph-elements.module';
import { PhChartsModule } from "../../../lib/ph-charts/ph-charts.module";

import { ClusterMatrixComponent } from '../dashboard-components/cluster-matrix/cluster-matrix.component';
import { PhasePowerComponent } from '../dashboard-components/phase-power/phase-power.component';
import { PhobosBackendService } from '../backend/phobos.backend.service';
import { re } from 'mathjs';
import { AuthService } from '../auth/services/auth.service';
import { PowerTotalComponent } from '../dashboard-components/power-total/power-total.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [
    PhElementsModule,
    PhChartsModule,
    ClusterMatrixComponent,
    PhasePowerComponent,
    PowerTotalComponent
]
})
export class DashboardComponent {
  public view: string = "CLOAK";
  public tab: string = "CLOAK"

  constructor(
    private readonly phobos: PhobosBackendService,
    public readonly auth: AuthService,
    private readonly changeDetector: ChangeDetectorRef
  ) { }

  public totalPower = 15

  public targetData = [ 
    [100, 100, 100, 100, 100, 100], [100, 100, 100, 100, 100, 100], [100, 100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100, 100], [100, 100, 100, 100, 100, 100], [100, 100, 100, 100, 100, 100]];

  public data = [
    [100, 100, 100, 100, 100, 100], [100, 100, 100, 100, 100, 100], [100, 100, 100, 100, 100, 100],
    [100, 100, 100, 100, 100, 100], [100, 100, 100, 100, 100, 100], [100, 100, 100, 100, 100, 100]];

  public jitter = [
    [4, 35, 5, 34, 28, 50 ], [15, 8, 13, 27, 10, 32], [33, 47, 9, 10, 6, 36], [8, 23, 1, 24, 37, 7], [
    48, 18, 49, 20, 46, 19], [25, 22, 26, 29, 31, 21]
  ];

  public mixingMatrix = [0.16, 0.16, 0.16, 0.16, 0.16, 0.16];
  public phasePower = [100, 100, 100, 100, 100, 100];

  private targetMatrix = [0.16, 0.16, 0.16, 0.16, 0.16, 0.16];
  private targetPower = [100, 100, 100, 100, 100, 100];

  ngAfterViewInit() {
    this.phobos.connect();

    this.phobos.onOpen.subscribe(async () => {
      const matrix = (await this.phobos.request({getClusterMixingMatrix: {}})).getClusterMixingMatrix?.matrix;
      const power = (await  this.phobos.request({getPhasePower: {}})).getPhasePower?.power;
      const targetMatrix = (await this.phobos.request({getTargetClusterMixingMatrix: {}})).getTargetClusterMixingMatrix?.matrix;
      const targetPower = (await this.phobos.request({getTargetPhasePower: {}})).getTargetPhasePower?.power;

      this.onMatrixChange(matrix!);
      this.onPowerChange(power!);
      this.onTargetMatrixChange(targetMatrix!);
      this.onTargetPowerChange(targetPower!);
    });

    this.phobos.onRequest.subscribe(async (request) => {
      if (request.request.setPhasePower) {
        const power = request.request.setPhasePower.power;
        this.phasePower = power;
        this.data = this.data.map((value, i) => {
          return value.map((currentValue, j) => {
            return this.phasePower[i] * this.mixingMatrix[j] * 150  / 100 + this.jitter[i][j];
          });
        });
    
        this.totalPower = power.reduce((a, b) => a + b, 0) / 100 * 15;
        this.totalPower = Math.round(this.totalPower * 100) / 100
        this.changeDetector.detectChanges();
      }
    });

    this.phobos.onRequest.subscribe(async (request) => {
     if (request.request.setTargetClusterMixingMatrix) {
       this.onTargetMatrixChange(request.request.setTargetClusterMixingMatrix.matrix);
     };

     if (request.request.setTargetPhasePower) {
       this.onTargetPowerChange(request.request.setTargetPhasePower.power);
     };
    });
  }

  onMatrixChange(matrix: number[]) {
    this.mixingMatrix = matrix;
    this.data = this.data.map((value, i) => {
      return value.map((currentValue, j) => {
        return matrix[j] * 150  * this.phasePower[i] / 100 + this.jitter[i][j];
      });
    });
    
    this.phobos.request(
      {setClusterMixingMatrix: {
        matrix: matrix
      }}
    )
  }

  onPowerChange(power: number[]) {
    this.phasePower = power;
    this.data = this.data.map((value, i) => {
      return value.map((currentValue, j) => {
        return this.phasePower[i] * this.mixingMatrix[j] * 150  / 100 + this.jitter[i][j];
      });
    });

    this.totalPower = power.reduce((a, b) => a + b, 0) / 100 * 15;
    this.totalPower = Math.round(this.totalPower * 100) / 100
    this.changeDetector.detectChanges();
    
    this.phobos.request(
      {setPhasePower: {
        power: power
      }}
    )
  }

  onTargetMatrixChange(matrix: number[]) {
    this.targetMatrix = matrix;
    this.targetData = this.targetData.map((value, i) => {
      return value.map((currentValue, j) => {
        return matrix[j] * this.targetPower[i] * 150 / 100 + this.jitter[i][j];
      });
    });
  }

  onTargetPowerChange(power: number[]) {
    this.targetPower = power;
    this.targetData = this.targetData.map((value, i) => {
      return value.map((currentValue, j) => {
        return this.targetMatrix[j] * power[i] * 150 / 100 + this.jitter[i][j];
      });
    });
  }
}
