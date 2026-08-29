import { Controller, Get, Headers, BadRequestException } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('dashboard')
  getDashboard(@Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    return this.metricsService.getDashboardMetrics(tenantId);
  }

  @Get('activity')
  getActivity(@Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    return this.metricsService.getRecentActivity(tenantId);
  }
}
