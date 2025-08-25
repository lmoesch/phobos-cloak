import { Component } from "@angular/core";
import { MatrixService } from "./matrix.service";
import { PhWindow } from "@phobos/elements";
import { PhBar3dComponent } from "../../../../lib/ph-charts/ph-bar3d/ph-bar3d.component";

@Component({
  selector: "app-matrix",
  imports: [
    PhBar3dComponent,
    PhWindow
  ],
  standalone: true,
  templateUrl: "./matrix.component.html",
  styleUrls: ["./matrix.component.scss"],
})
export class MatrixComponent {
  constructor(
    public readonly matrix: MatrixService
  ) {}
}
