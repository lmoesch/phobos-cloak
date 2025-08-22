import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ph-topbar-item',
    templateUrl: './ph-topbar-item.component.html',
    styleUrls: ['./ph-topbar-item.component.scss'],
    standalone: false
})
export class PhTopbarItemComponent implements OnInit {

  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
