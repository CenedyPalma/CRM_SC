
import { Controller, Get, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { SubscriptionService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Get()
  async findAll(@Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('x-tenant-id is required');
    return this.service.findAll(tenantId);
  }

  @Post()
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: any) {
    if (!tenantId) throw new BadRequestException('x-tenant-id is required');
    return this.service.create(tenantId, data);
  }
}
