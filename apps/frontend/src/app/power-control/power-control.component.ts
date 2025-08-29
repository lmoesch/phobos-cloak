import { Component } from "@angular/core";
import { PhWindow } from "@phobos/elements";

import { PhasePowerComponent } from "../infrastructure/ui/phase-power/phase-power.component";
import { PowerTotalComponent } from "../infrastructure/ui/power-total/power-total.component";
import { MatrixService } from "../common/matrix/matrix.service";
import { MatrixRpcAdapter } from "../common/matrix/rpc/matrix.rpc.adapter";

@Component({
  selector: "app-power-control",
  imports: [
    PowerTotalComponent,
    PhasePowerComponent,
    PhWindow
  ],
  templateUrl: "./power-control.component.html",
  styleUrls: ["./power-control.component.scss"]
})
export class PowerControlComponent {
  public totalPower: number = 0;

  constructor(
    public readonly matrix: MatrixService,
    private readonly rpc: MatrixRpcAdapter
  ) {}

  onPowerChange(power: number[]) {
    this.matrix.phasePower.set(power);
    this.rpc.setPhasePower(power);
  }
}
