import { Controller, Get, Post, Body, Param, Delete, Headers, Patch } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    const tenant = tenantId || 'default-tenant';
    return this.webhooksService.findAll(tenant);
  }

  @Post()
  create(@Body() data: { url: string; events: string[] }, @Headers('x-tenant-id') tenantId: string) {
    const tenant = tenantId || 'default-tenant';
    return this.webhooksService.create(data, tenant);
  }

  @Patch(':id/status')
  toggleStatus(
    @Param('id') id: string, 
    @Body('isActive') isActive: boolean,
    @Headers('x-tenant-id') tenantId: string
  ) {
    const tenant = tenantId || 'default-tenant';
    return this.webhooksService.toggleActive(id, isActive, tenant);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('x-tenant-id') tenantId: string) {
    const tenant = tenantId || 'default-tenant';
    return this.webhooksService.delete(id, tenant);
  }
}
