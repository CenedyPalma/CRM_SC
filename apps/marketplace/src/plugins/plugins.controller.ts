import { Controller, Get, Post, Delete, Param, Headers, BadRequestException } from '@nestjs/common';
import { PluginsService } from './plugins.service';

@Controller('plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    return this.pluginsService.findAll(tenantId);
  }

  @Post(':id/install')
  install(@Param('id') id: string, @Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    return this.pluginsService.install(tenantId, id);
  }

  @Delete(':id/uninstall')
  uninstall(@Param('id') id: string, @Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    return this.pluginsService.uninstall(tenantId, id);
  }
}
