import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findProjects(tenantId: string) {
    return this.prisma.project.findMany({
      where: { tenantId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrCreateProject(tenantId: string, name: string) {
    const existing = await this.prisma.project.findFirst({
      where: { tenantId, name }
    });
    if (existing) return existing;
    return this.prisma.project.create({
      data: { tenantId, name }
    });
  }

  async createTask(projectId: string, data: { title: string, description?: string, status?: string }) {
    return this.prisma.task.create({
      data: {
        projectId,
        title: data.title,
        description: data.description,
        status: data.status || 'TODO',
      }
    });
  }

  async updateTaskStatus(taskId: string, status: string) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status }
    });
  }
}
