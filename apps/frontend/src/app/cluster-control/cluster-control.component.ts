import { Component } from "@angular/core";
import { MatrixComponent } from "../common/matrix/matrix.component";
import { PhWindow } from "@phobos/elements";
import { ClusterMatrixComponent } from "../infrastructure/ui/cluster-matrix/cluster-matrix.component";

@Component({
  selector: "app-cluster-control",
  imports: [
    ClusterMatrixComponent,
    MatrixComponent,
    PhWindow
  ],
  templateUrl: "./cluster-control.component.html",
  styleUrls: ["./cluster-control.component.scss"]
})
export class ClusterControlComponent {
    
}