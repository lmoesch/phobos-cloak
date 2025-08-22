import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ph-dropdown-item',
    templateUrl: './ph-dropdown-item.component.html',
    styleUrls: ['./ph-dropdown-item.component.scss'],
    standalone: false
})
export class PhDropdownItemComponent implements OnInit {

    @Input() label: string = "";
    @Input() value: any = "";

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {}

    constructor() { }

    ngOnInit(): void {
    }

}
