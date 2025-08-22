import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ph-topbar-header',
    templateUrl: './ph-topbar-header.component.html',
    styleUrls: ['./ph-topbar-header.component.scss'],
    standalone: false
})
export class PhTopbarHeaderComponent implements OnInit {

  @Input() title: string = '';
  @Input() subtitle: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
