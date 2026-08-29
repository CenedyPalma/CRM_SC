import { Module } from '@nestjs/common';
import { CustomObjectsService } from './custom-objects.service';
import { CustomObjectsController } from './custom-objects.controller';

@Module({
  controllers: [CustomObjectsController],
  providers: [CustomObjectsService],
})
export class CustomObjectsModule {}
