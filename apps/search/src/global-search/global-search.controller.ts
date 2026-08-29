import { Controller, Get, Query, Headers, BadRequestException } from '@nestjs/common';
import { GlobalSearchService } from './global-search.service';

@Controller('search')
export class GlobalSearchController {
  constructor(private readonly searchService: GlobalSearchService) {}

  @Get()
  async search(
    @Headers('x-tenant-id') tenantId: string,
    @Query('q') query: string
  ) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    if (!query) return [];
    
    return this.searchService.search(tenantId, query);
  }
}
