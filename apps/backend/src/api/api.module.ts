import { Module } from '@nestjs/common';
import { PhobosApiController } from './phobos/phobos.api.controller';

@Module({
  imports: [
  ],
  controllers: [],
  providers: [
    PhobosApiController
  ],
})
export class ApiModule {}