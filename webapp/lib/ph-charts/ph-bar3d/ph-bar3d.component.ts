import { AfterViewInit, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { multiply } from 'mathjs';
import { Bar3D } from './core/bar3d';


@Component({
    selector: 'ph-bar-chart-3d',
    templateUrl: './ph-bar3d.component.html',
    styleUrl: './ph-bar3d.component.scss',
    standalone: false
})
export class PhBar3dComponent implements AfterViewInit {
  @Input() data: any

  @ViewChild('chart') chart!: ElementRef<SVGElement>;

  ngAfterViewInit(): void {
    // this.render(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'].isFirstChange()) {
      this.render(this.data);
    } else {
      this.render(this.data, changes['data'].previousValue);
    }
  }

  public render(data: any, previousData?: any) {
    const size = 40;
    const gap = 15;
    let innerHTML = '<g transform="translate(150 320)">';
    
    innerHTML += `
      <defs>
        <linearGradient id="grad1" gradientTransform="rotate(90)">
          <stop offset="5%" stop-color="rgb(255,255,255,0.7)" />
          <stop offset="40%" stop-color="rgb(57,135,130,0.9)" />
          <stop offset="95%" stop-color="rgb(0,11,36,0.9)"/>
        </linearGradient>
      </defs>`

    for (let i = data.length - 1; i >= 0; i--) {
      for (let j = data[i].length - 1; j >= 0; j--) {
        if (previousData) {
          const faces = Bar3D.getFaces({x: size * i + gap * i, y: size * j + gap * j, size: size, height: data[i][j]})
          const previousFaces = Bar3D.getFaces({x: size * i + gap * i, y: size * j + gap * j, size: size, height: previousData[i][j]})
          
          for (const [index, [face, previousFace]] of faces.map((face, index) => [face, previousFaces[index]]).entries()) {
            innerHTML += `<polygon points="${previousFace}"  stroke="black" class="${(index + 1) % 3 ? "frame": "frame2"}">
            <animate attributeName="points" dur="3s" fill="remove"
              to="${face}"
              from="${previousFace}"/>
            </polygon>`;
          }
        } else {
          for (const [index, face] of Bar3D.getFaces({x: size * i + gap * i, y: size * j + gap * j, size: size, height: data[i][j]}).entries()) {
            innerHTML += `<polygon points="${face}"  stroke="black" class="${(index + 1) % 3 ? "frame": "frame2"}" />`;
          }
        }
      }
    }
    try {
      this.chart.nativeElement.innerHTML = innerHTML + '</g>';
      // Wait for next event cycle to start the animation
      setTimeout(() => {
        for (const animation of this.chart.nativeElement.getElementsByTagName('animate')) {
          animation.beginElement();
          animation.setAttribute('fill', 'freeze');
        }
      }, 1);                                    
    } catch (e) {
      console.error(e);
    }
  }

  
}
