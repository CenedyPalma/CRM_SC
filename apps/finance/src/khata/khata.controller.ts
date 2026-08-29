import { Controller, Get, Param, Req, UnauthorizedException } from '@nestjs/common';
import { KhataService } from './khata.service';

@Controller('khata')
export class KhataController {
  constructor(private readonly khataService: KhataService) {}

  @Get('balance/:contactId')
  async getBalance(@Param('contactId') contactId: string, @Req() req: any) {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    return this.khataService.getBalanceForContact(tenantId, contactId);
  }
}
