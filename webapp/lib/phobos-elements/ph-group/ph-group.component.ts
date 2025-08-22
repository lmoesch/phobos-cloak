import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'ph-group',
    templateUrl: './ph-group.component.html',
    styleUrls: ['./ph-group.component.scss'],
    standalone: false
})
export class PhGroupComponent implements OnInit {
    @Input() label: string = '';

    ngOnInit(): void {
    }
}