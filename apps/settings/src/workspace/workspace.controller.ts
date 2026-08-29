import { Controller, Get, Body, Put, Headers, UseGuards } from '@nestjs/common';
import { WorkspaceSettingsService } from './workspace.service';

@Controller('settings/workspace')
export class WorkspaceSettingsController {
  constructor(private readonly service: WorkspaceSettingsService) {}

  @Get()
  async getSettings(@Headers('x-tenant-id') tenantId: string) {
    return this.service.getSettings(tenantId || 'default-tenant');
  }

  @Put()
  async updateSettings(
    @Headers('x-tenant-id') tenantId: string,
    @Body() body: any
  ) {
    return this.service.updateSettings(tenantId || 'default-tenant', body);
  }
}
