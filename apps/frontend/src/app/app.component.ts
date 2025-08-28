import { Component, effect, Inject, Optional } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ITokenService, TOKEN_SERVICE_TOKEN } from '@phobos/core';
import { CloakGateway } from './infrastructure/cloak.gateway';

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
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'phobos-cloak';

    autoCloakGatewayConnection = effect(async () => {
    // if (this.tokenService && !this.cloakGateway.isConnected()) {
    if (!this.cloakGateway.isConnected()) {
      await this.connectToCloakGateway();
    }
  });

  constructor(
    private cloakGateway: CloakGateway,
    @Optional() @Inject(TOKEN_SERVICE_TOKEN) private tokenService: ITokenService
  ) {

  }

   private async connectToCloakGateway(): Promise<void> {
    const token = this.tokenService?.accessToken() || '';
    if (token) {
      try {
        await this.cloakGateway.connect(token);
      } catch (error) {
        console.error('Error connecting to Cloak Gateway:', error);
        setTimeout(async () => {
          await this.connectToCloakGateway();
        }, 5000);
      }
    } else {
      console.warn('No token found, unable to connect to Cloak Gateway');
    }
  }
}
