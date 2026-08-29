import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { AutomationsService } from './automations.service';

@Controller('workflows')
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Get()
  async getWorkflows(@Headers('x-tenant-id') tenantId: string) {
    return this.automationsService.getWorkflows(tenantId || 'default-tenant');
  }

  @Post()
  async createWorkflow(
    @Headers('x-tenant-id') tenantId: string,
    @Body() data: any
  ) {
    return this.automationsService.createWorkflow(tenantId || 'default-tenant', data);
  }
}
