import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ph-command-list',
    templateUrl: './ph-command-list.component.html',
    styleUrls: ['./ph-command-list.component.scss'],
    standalone: false
})
export class PhCommandListComponent implements OnInit {

  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
