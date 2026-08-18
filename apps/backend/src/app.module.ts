import { Global, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule, WinstonLoggerModule } from '@phobos/infrastructure';
import { AppGateway } from './app.gateway';
import { ApiModule } from './api/api.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RolesGuard } from './common/guards/roles.guards';


@Global()
@Module({
  imports: [
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    EventEmitterModule.forRoot(),
    ApiModule,
    WinstonLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, RolesGuard],
  exports: [AppGateway]
})
export class AppModule {}
