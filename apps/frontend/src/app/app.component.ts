import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare global {
    interface Window {
        __env: {
            CLOAK_SERVER_HOSTNAME: string;
            CLOAK_SERVER_PORT: number;
        };
    }
}

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet
    ],
    providers: [],
    template: `<router-outlet />`,
    styles: []
})

export class AppComponent {
  title = 'phobos-cloak';
}
