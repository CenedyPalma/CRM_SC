
import { Controller, Get, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { LocalizationService } from './localization.service';

@Controller('localization')
export class LocalizationController {
  constructor(private readonly service: LocalizationService) {}

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
