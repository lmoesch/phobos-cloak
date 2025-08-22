import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ph-button',
    templateUrl: './ph-button.component.html',
    styleUrls: ['./ph-button.component.scss'],
    standalone: false
})
export class PhButtonComponent implements OnInit {

  @Input() value: string | number = '';
  @Input() isActive: boolean = false;

  constructor() { }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {}

  ngOnInit(): void {
  }

}
