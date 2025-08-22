import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PhobosBackendService } from './backend/phobos.backend.service';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet
    ],
    providers: [PhobosBackendService],
    template: `<router-outlet />`,
    styles: []
})

export class AppComponent {
  title = 'phobos-cloak';
}
