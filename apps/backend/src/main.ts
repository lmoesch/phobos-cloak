import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { WinstonLogger } from '@phobos/infrastructure';
import { RpcModule } from '../lib/rpc-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true }) as NestApplication;
  const logger = await app.resolve(WinstonLogger);
  const rpcModule = new RpcModule();

  app.enableCors();
  app.useLogger(logger);
  app.useWebSocketAdapter(new WsAdapter(app));

  rpcModule.register(app["container"]);

  await app.listen(4006);
}
bootstrap();
