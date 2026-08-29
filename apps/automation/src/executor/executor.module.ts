import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WorkflowProcessor } from './workflow.processor';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'workflows',
    }),
  ],
  providers: [WorkflowProcessor],
})
export class ExecutorModule {}
