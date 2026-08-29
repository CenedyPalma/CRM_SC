import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  private getTenant(tenantIdHeader?: string) {
    return tenantIdHeader || 'default-tenant';
  }

  @Post()
  create(
    @Headers('x-tenant-id') tenantIdHeader: string,
    @Body() createKnowledgeDto: any
  ) {
    return this.knowledgeService.create(this.getTenant(tenantIdHeader), createKnowledgeDto);
  }

  @Get()
  findAll(@Headers('x-tenant-id') tenantIdHeader: string) {
    return this.knowledgeService.findAll(this.getTenant(tenantIdHeader));
  }

  @Get(':id')
  findOne(
    @Headers('x-tenant-id') tenantIdHeader: string,
    @Param('id') id: string
  ) {
    return this.knowledgeService.findOne(this.getTenant(tenantIdHeader), id);
  }

  @Patch(':id')
  update(
    @Headers('x-tenant-id') tenantIdHeader: string,
    @Param('id') id: string, 
    @Body() updateKnowledgeDto: any
  ) {
    return this.knowledgeService.update(this.getTenant(tenantIdHeader), id, updateKnowledgeDto);
  }

  @Delete(':id')
  remove(
    @Headers('x-tenant-id') tenantIdHeader: string,
    @Param('id') id: string
  ) {
    return this.knowledgeService.remove(this.getTenant(tenantIdHeader), id);
  }
}
