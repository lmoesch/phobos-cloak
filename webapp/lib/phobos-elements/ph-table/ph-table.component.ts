import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ph-table',
  templateUrl: './ph-table.component.html',
  styleUrls: ['./ph-table.component.scss']
})
export class PhTableComponent implements OnInit {

  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
