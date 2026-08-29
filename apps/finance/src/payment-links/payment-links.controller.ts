
import { Controller, Get, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { PaymentLinkService } from './payment-links.service';

@Controller('payment-links')
export class PaymentLinkController {
  constructor(private readonly service: PaymentLinkService) {}

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
