import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { RpcModule } from '../lib/rpc-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule) as NestApplication;
  const rpcModule = new RpcModule();

  app.enableCors();
  app.useWebSocketAdapter(new WsAdapter(app));

  rpcModule.register(app["container"]);

  await app.listen(3100);
}
bootstrap();
