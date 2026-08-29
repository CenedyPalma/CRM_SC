
import { Controller, Get, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { ChatWidgetService } from './chat-widgets.service';

@Controller('chat-widgets')
export class ChatWidgetController {
  constructor(private readonly service: ChatWidgetService) {}

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
