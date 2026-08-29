
import { Controller, Get, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { PriceBookService } from './price-books.service';

@Controller('price-books')
export class PriceBookController {
  constructor(private readonly service: PriceBookService) {}

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
