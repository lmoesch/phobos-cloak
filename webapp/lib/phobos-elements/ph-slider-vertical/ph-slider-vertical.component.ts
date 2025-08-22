import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
    selector: 'ph-slider-vertical',
    templateUrl: './ph-slider-vertical.component.html',
    styleUrls: ['./ph-slider-vertical.component.scss'],
    standalone: false
})
export class PhSliderVerticalComponent implements OnChanges, AfterViewInit  {
    public math = Math;
    public active = 0;

    @Input() public label = '';
    @Input() public value: number = 0;
    @Input() public unit: string = '';
    @Input() public ticks: string[] = [];
    @Input() public tickValues: any[] = [];

    @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild('track') track!: ElementRef<HTMLDivElement>;
    @ViewChild('handle') handle!: ElementRef<HTMLDivElement>;


    private dragged = false;

    constructor() { 
        window.addEventListener('mouseup', (e) => {  
            this.onDragEnd();
        });

        window.addEventListener('touchend', (e) => {  
            this.onDragEnd();
        });
    }

    ngAfterViewInit(): void {
        const height = this.track.nativeElement.clientHeight;
        const rect = this.track.nativeElement.getBoundingClientRect(); 
        const offsetTop = (100 - this.value) / 100 * height;

        this.handle.nativeElement.style.top = `${Math.max(Math.min(offsetTop  - 10, height), 0) }px`;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.dragged) {
            const height = this.track.nativeElement.clientHeight;
            const offsetTop = (100 - this.value) / 100 * height;
            console.log(this.value, "?");
            this.handle.nativeElement.style.top = `${Math.max(Math.min(offsetTop  - 10, height), 0) }px`;
        }
    }

    onDragStart() {
        this.dragged = true;
        this.update();
    }

    onDrag(e: MouseEvent) {
        if (this.dragged) {
            const height = this.track.nativeElement.clientHeight;
            const rect = this.track.nativeElement.getBoundingClientRect(); 
            this.handle.nativeElement.style.top = `${Math.max(Math.min(e.y - rect.top - 10, height), 0) }px`;
            this.update()
        }
    }

    onTouchDrag(e: TouchEvent) {
        if (this.dragged) {
            const height = this.track.nativeElement.clientHeight;
            const rect = this.track.nativeElement.getBoundingClientRect(); 
            this.handle.nativeElement.style.top = `${Math.max(Math.min(e.changedTouches[0].clientY - rect.top - 10, height), 0) }px`;
            this.update()
        }
    }


    onDragEnd() {
        this.dragged = false;

    }

    setTick() {
        const width = this.track.nativeElement.clientWidth + 2;
        const p = (this.active / (this.ticks.length - 1)) * 100;
        this.track.nativeElement.style.background = `linear-gradient(90deg, #f8a403 0%, #f8a403 ${p}%, rgba(0, 0, 0, 0) ${p}%, rgba(0, 0, 0, 0) 100%)`;
        this.handle.nativeElement.style.left = `${(this.active / (this.ticks.length - 1)) * width  - 10}px`; 
    }

    private update() {
        this.value = 100 - Math.round((this.handle.nativeElement.offsetTop / this.track.nativeElement.clientHeight) * 100);
        this.valueChange.next(this.value);
    }
}
