import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '@phobos/infrastructure';
import * as jose from 'jose';
import { Ws } from '../interfaces/ws';
import { ROLES_METADATA } from '../constants';

/**
 * Guard that checks if the client is authorized to access the resource based on a JWT.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  /**
   * Determines whether the client is authorized to access the resource.
   * @param context - The execution context containing the requesting client.
   * @returns A boolean indicating whether the client is authorized.
   * @throws UnauthorizedException if the client is not authorized.
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToWs().getClient<Ws>().token;
    const roles = Reflect.getMetadata(ROLES_METADATA, context.getHandler()) as string[];

    if (!roles) {
      return true;
    }

    if (!token || !(await this.authService.validateToken(token))) {
      return false;
    }

    try {
      const { scope } = jose.decodeJwt(token) as { scope?: string };

      if (!roles.includes(scope || '')) {
        return false;
      }

    } catch {
      return false;
    }
    return true;
  }
}
