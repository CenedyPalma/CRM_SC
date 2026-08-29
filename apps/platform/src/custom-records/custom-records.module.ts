import { Module } from '@nestjs/common';
import { CustomRecordsService } from './custom-records.service';
import { CustomRecordsController } from './custom-records.controller';

@Module({
  controllers: [CustomRecordsController],
  providers: [CustomRecordsService],
})
export class CustomRecordsModule {}
