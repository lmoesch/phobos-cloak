import { Component, Input } from '@angular/core';

@Component({
    selector: 'phobos-cloak-power-total',
    imports: [],
    templateUrl: './power-total.component.html',
    styleUrl: './power-total.component.scss'
})
export class PowerTotalComponent {
  @Input() public power: number = 0;
}
