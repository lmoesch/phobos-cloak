import { Global, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { AppGateway } from './app.gateway';
import { LoggingModule } from './core/logging/logging.module';
import { ApiModule } from './api/api.module';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Global()
@Module({
  imports: [
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    EventEmitterModule.forRoot(),
    ApiModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
  exports: [AppGateway]
})
export class AppModule {}
