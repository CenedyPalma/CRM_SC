import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('workflows') private readonly workflowQueue: Queue
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async evaluateReminders() {
    this.logger.log('Running daily CRON job to evaluate automated reminders...');
    
    const activeWorkflows = await this.prisma.workflow.findMany({
      where: { isActive: true }
    });

    this.logger.log(`Found ${activeWorkflows.length} active workflows to evaluate.`);
  }

  async trigger(tenantId: string, id: string, triggerData: any) {
    const workflow = await this.findOne(tenantId, id);
    if (!workflow.isActive) {
      throw new Error('Workflow is not active');
    }

    const job = await this.workflowQueue.add('execute-workflow', {
      workflowId: workflow.id,
      tenantId: tenantId,
      triggerData: triggerData
    });

    return { success: true, jobId: job.id };
  }

  async create(tenantId: string, data: any) {
    return this.prisma.workflow.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
        triggerType: data.triggerType,
        triggerData: data.triggerData || {}
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.workflow.findMany({
      where: { tenantId },
      include: { actions: true }
    });
  }

  async findOne(tenantId: string, id: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id, tenantId },
      include: { actions: true }
    });
    if (!workflow) throw new NotFoundException('Workflow not found');
    return workflow;
  }

  async update(tenantId: string, id: string, data: any) {
    const workflow = await this.findOne(tenantId, id);
    return this.prisma.workflow.update({
      where: { id: workflow.id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const workflow = await this.findOne(tenantId, id);
    return this.prisma.workflow.delete({
      where: { id: workflow.id },
    });
  }
}
