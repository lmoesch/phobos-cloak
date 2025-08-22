import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const PHOBOS_CLOAK_SERVER_HOSTNAME = window?.__env?.phobosCloakServerHostname != null ? `${window.__env.phobosCloakServerHostname}` : window.location.hostname;
const PHOBOS_CLOAK_SERVER_PORT = window?.__env?.phobosCloakServerPort != null ? window.__env.phobosCloakServerPort : window.location.port;

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthService {

  private token: string = "";
  public username: string = "";  

  constructor(private readonly http: HttpClient) {

  }

  public async requestJwt(username: string, password: string): Promise<string>
  {
    const data = {username: username, password: password};
    const route = `${window.location.protocol}//${PHOBOS_CLOAK_SERVER_HOSTNAME}:${PHOBOS_CLOAK_SERVER_PORT}/api/auth/login`;

    return new Promise<string>((resolve, reject) => {
      this.http.post<{access_token: string}>(route, data).subscribe({
        next: (res) => {
          console.log(res);
          this.token = res.access_token;
          this.username = username;
          resolve(res.access_token);
        },
        error: (err) => {
          reject(err);
        }
      })
    });
  }

  public isAuthenticated(): boolean {
    return this.token != '';
  }
}
