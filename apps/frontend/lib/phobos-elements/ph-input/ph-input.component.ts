import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'ph-input',
    templateUrl: './ph-input.component.html',
    styleUrls: ['./ph-input.component.scss'],
    standalone: false
})
export class PhInputComponent implements OnInit {

  @Input() label: string = "";
  @Input() type: string = "text";
  @Input() value: string | number = "";

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onValueChange(event: any) {
    this.valueChange.emit(event.target.value);
  }

}
