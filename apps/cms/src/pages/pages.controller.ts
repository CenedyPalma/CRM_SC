import { Controller, Get, Post, Put, Body, Param, Headers, Req } from '@nestjs/common';
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.pagesService.findAll(tenantId);
  }

  // Public endpoint for published pages via slug
  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('x-tenant-id') tenantId: string) {
    return this.pagesService.findOne(tenantId, id);
  }

  @Post()
  create(@Headers('x-tenant-id') tenantId: string, @Body() data: any) {
    return this.pagesService.create(tenantId, data);
  }

  @Put(':id/blocks')
  updateBlocks(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantId: string,
    @Body('blocks') blocks: any[],
  ) {
    return this.pagesService.updateBlocks(tenantId, id, blocks);
  }
}
