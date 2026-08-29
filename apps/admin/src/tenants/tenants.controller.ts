import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }

  @Post()
  create(@Body() data: { name: string; domain?: string }) {
    return this.tenantsService.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantsService.delete(id);
  }
}
