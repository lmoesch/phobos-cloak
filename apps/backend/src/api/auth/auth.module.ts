import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategys/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from '../../common/guards/auth.guard';

export const jwtConstants = {
  secret: '37GqbZWodvVxnJ4L4NFU',
};

@Module({
  controllers: [
    AuthController,
  ],
  imports: [
    PassportModule,
    JwtModule.register({
      global: true, 
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {

}
