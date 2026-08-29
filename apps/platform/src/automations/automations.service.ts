import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AutomationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkflow(tenantId: string, data: any) {
    return this.prisma.workflow.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? false,
        triggerType: data.triggerType,
        triggerData: data.triggerData || {},
        actions: {
          create: data.actions?.map((action: any, index: number) => ({
            actionType: action.type,
            actionData: action.data || {},
            orderIndex: index,
          })) || []
        }
      },
      include: {
        actions: true
      }
    });
  }

  async getWorkflows(tenantId: string) {
    return this.prisma.workflow.findMany({
      where: { tenantId },
      include: { actions: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async processWorkflowTrigger(tenantId: string, triggerType: string, payload: any) {
    // 1. Find active workflows matching trigger
    const workflows = await this.prisma.workflow.findMany({
      where: { tenantId, triggerType, isActive: true },
      include: { actions: { orderBy: { orderIndex: 'asc' } } }
    });

    // 2. Execute graph logic 
    for (const workflow of workflows) {
      await this.executeWorkflow(workflow, payload);
    }
  }

  private async executeWorkflow(workflow: any, payload: any) {
    console.log(`Executing Workflow: ${workflow.name} [${workflow.id}]`);
    let context = { ...payload };

    for (const action of workflow.actions) {
      console.log(` -> Running Action: ${action.actionType}`);
      try {
        switch (action.actionType) {
          case 'SEND_EMAIL':
            console.log('Sending email with data:', action.actionData);
            break;
          case 'CREATE_RECORD':
            console.log('Creating record with data:', action.actionData);
            break;
          case 'GENERATE_PDF':
            console.log('Generating PDF');
            break;
          default:
            console.log('Unknown action type:', action.actionType);
        }
      } catch (e) {
        console.error(`Workflow Action failed:`, e);
      }
    }
  }
}
