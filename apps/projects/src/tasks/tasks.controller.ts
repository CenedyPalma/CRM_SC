import { Controller, Get, Post, Body, Headers, BadRequestException, Param, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('projects')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getProjects(@Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    
    let projects = await this.tasksService.findProjects(tenantId);
    
    // Seed some initial data for demo purposes
    if (projects.length === 0) {
      const p = await this.tasksService.getOrCreateProject(tenantId, "Q3 Marketing Launch");
      await this.tasksService.createTask(p.id, { title: "Draft campaign brief", status: "DONE" });
      await this.tasksService.createTask(p.id, { title: "Design ad creatives", status: "REVIEW" });
      await this.tasksService.createTask(p.id, { title: "Setup tracking pixels", status: "IN_PROGRESS" });
      await this.tasksService.createTask(p.id, { title: "Approve budget allocation", status: "TODO" });
      
      projects = await this.tasksService.findProjects(tenantId);
    }
    
    return projects;
  }

  @Post(':projectId/tasks')
  async createTask(
    @Param('projectId') projectId: string,
    @Body() data: { title: string, description?: string, status?: string }
  ) {
    return this.tasksService.createTask(projectId, data);
  }

  @Patch('tasks/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() data: { status: string }
  ) {
    return this.tasksService.updateTaskStatus(id, data.status);
  }
}
