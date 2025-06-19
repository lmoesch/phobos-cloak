import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface Ws extends WebSocket {
  id: string;
  token?: string;
}

/**
 * Guard that checks if the client is authorized to access the resource based on a JWT.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Determines whether the client is authorized to access the resource.
   * @param context - The execution context containing the requesting client.
   * @returns A boolean indicating whether the client is authorized.
   * @throws UnauthorizedException if the client is not authorized.
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = this.extractToken(context); 

    if (!token) {
      throw new UnauthorizedException();
    } 

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: "37GqbZWodvVxnJ4L4NFU"
      });

    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractToken(context: ExecutionContext): string { 
    switch (context.getType()) {
      case 'ws':
        return context.switchToWs().getClient<Ws>().token;
      case 'http':
        return context.switchToHttp().getRequest().headers.authorization.split(' ')[1];
      default:
        throw new Error('Unsupported context type');
    }
  }
}
