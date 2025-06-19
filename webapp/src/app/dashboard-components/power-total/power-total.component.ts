import { Component, Input } from '@angular/core';

@Component({
  selector: 'phobos-cloak-power-total',
  standalone: true,
  imports: [],
  templateUrl: './power-total.component.html',
  styleUrl: './power-total.component.scss'
})
export class PowerTotalComponent {
  @Input() public power: number = 0;
}
