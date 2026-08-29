import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';

@Controller('custom-objects/:objectId/fields')
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @Post()
  create(
    @Param('objectId') objectId: string,
    @Body() createCustomFieldDto: any
  ) {
    return this.customFieldsService.create(objectId, createCustomFieldDto);
  }

  @Get()
  findAll(@Param('objectId') objectId: string) {
    return this.customFieldsService.findAll(objectId);
  }

  @Get(':id')
  findOne(
    @Param('objectId') objectId: string,
    @Param('id') id: string
  ) {
    return this.customFieldsService.findOne(objectId, id);
  }

  @Patch(':id')
  update(
    @Param('objectId') objectId: string,
    @Param('id') id: string, 
    @Body() updateCustomFieldDto: any
  ) {
    return this.customFieldsService.update(objectId, id, updateCustomFieldDto);
  }

  @Delete(':id')
  remove(
    @Param('objectId') objectId: string,
    @Param('id') id: string
  ) {
    return this.customFieldsService.remove(objectId, id);
  }
}
