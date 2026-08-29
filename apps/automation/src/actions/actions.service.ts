import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workflowId: string, data: any) {
    return this.prisma.workflowAction.create({
      data: {
        workflowId,
        actionType: data.actionType,
        actionData: data.actionData || {},
        orderIndex: data.orderIndex ?? 0,
        parentActionId: data.parentActionId
      },
    });
  }

  async findAll(workflowId: string) {
    return this.prisma.workflowAction.findMany({
      where: { workflowId },
      orderBy: { orderIndex: 'asc' }
    });
  }

  async findOne(workflowId: string, id: string) {
    const action = await this.prisma.workflowAction.findFirst({
      where: { id, workflowId }
    });
    if (!action) throw new NotFoundException('Workflow Action not found');
    return action;
  }

  async update(workflowId: string, id: string, data: any) {
    const action = await this.findOne(workflowId, id);
    return this.prisma.workflowAction.update({
      where: { id: action.id },
      data,
    });
  }

  async remove(workflowId: string, id: string) {
    const action = await this.findOne(workflowId, id);
    return this.prisma.workflowAction.delete({
      where: { id: action.id },
    });
  }
}
