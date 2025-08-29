import { Component, effect, Inject, Optional } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ITokenService, TOKEN_SERVICE_TOKEN } from "@phobos/core";
import { CloakGateway } from "./infrastructure/cloak.gateway";

declare global {
  interface Window {
    __env: {
      CLOAK_SERVER_HOSTNAME: string;
      CLOAK_SERVER_PORT: number;
    };
  }
}

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  providers: [],
  template: `<router-outlet />`,
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "phobos-cloak";

  autoCloakGatewayConnection = effect(async () => {
    // if (this.tokenService && !this.cloakGateway.isConnected()) {
    console.log("AppComponent effect triggered");
    if (!this.cloakGateway.isConnected()) {
      await this.connectToCloakGateway();
    }
  });

  constructor(
    private cloakGateway: CloakGateway,
    @Optional() @Inject(TOKEN_SERVICE_TOKEN) private tokenService: ITokenService
  ) {}

  private async connectToCloakGateway(): Promise<void> {
    try {
      console.log("Connecting to Cloak Gateway with token:");
      await this.cloakGateway.connect();
    } catch (error) {
      console.error("Error connecting to Cloak Gateway:", error);
      setTimeout(async () => {
        await this.connectToCloakGateway();
      }, 5000);
    }
  }
}
