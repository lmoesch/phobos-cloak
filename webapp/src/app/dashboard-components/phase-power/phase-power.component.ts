
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhElementsModule } from '../../../../lib/phobos-elements/ph-elements.module';
import { PhobosBackendService } from '../../backend/phobos.backend.service';

@Component({
    selector: 'ph-cloak-phase-power',
    imports: [
    PhElementsModule
],
    templateUrl: './phase-power.component.html',
    styleUrl: './phase-power.component.scss'
})
export class PhasePowerComponent {

  @Input() power = [100, 100, 100, 100, 100, 100]
  @Output() powerChange: EventEmitter<number[]> = new EventEmitter<number[]>();

  constructor(private readonly phobos: PhobosBackendService) { }

  ngAfterViewInit() {
    this.phobos.onOpen.subscribe(async () => {
      const power = (await this.phobos.request({getPhasePower: {}})).getPhasePower?.power;
      this.power = power!;
    });

    this.phobos.onRequest.subscribe(async (request) => {
      if (request.request.setPhasePower) {
        this.power = request.request.setPhasePower.power;
      }
    });
  }

  onSliderValueChange(index: number, value: number) {
    this.power[index] = value;
    this.powerChange.emit(this.power);
  }
}
