import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { CustomRecordsService } from './custom-records.service';

@Controller('custom-objects/:objectId/records')
export class CustomRecordsController {
  constructor(private readonly customRecordsService: CustomRecordsService) {}

  private getTenant(tenantIdHeader?: string) {
    return tenantIdHeader || 'default-tenant';
  }

  @Post()
  create(
    @Headers('x-tenant-id') tenantIdHeader: string,
    @Param('objectId') objectId: string,
    @Body() createCustomRecordDto: any
  ) {
    return this.customRecordsService.create(this.getTenant(tenantIdHeader), objectId, createCustomRecordDto);
  }

  @Get()
  findAll(
    @Headers('x-tenant-id') tenantIdHeader: string,
    @Param('objectId') objectId: string
  ) {
    return this.customRecordsService.findAll(this.getTenant(tenantIdHeader), objectId);
  }

  @Get(':id')
  findOne(
    @Headers('x-tenant-id') tenantIdHeader: string,
    @Param('objectId') objectId: string,
    @Param('id') id: string
  ) {
    return this.customRecordsService.findOne(this.getTenant(tenantIdHeader), objectId, id);
  }

  @Patch(':id')
  update(
    @Headers('x-tenant-id') tenantIdHeader: string,
    @Param('objectId') objectId: string,
    @Param('id') id: string, 
    @Body() updateCustomRecordDto: any
  ) {
    return this.customRecordsService.update(this.getTenant(tenantIdHeader), objectId, id, updateCustomRecordDto);
  }

  @Delete(':id')
  remove(
    @Headers('x-tenant-id') tenantIdHeader: string,
    @Param('objectId') objectId: string,
    @Param('id') id: string
  ) {
    return this.customRecordsService.remove(this.getTenant(tenantIdHeader), objectId, id);
  }
}
