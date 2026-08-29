import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { TwilioController } from './twilio.controller';
import { TwilioService } from './twilio.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ActionsController, TwilioController],
  providers: [ActionsService, TwilioService],
})
export class ActionsModule {}
