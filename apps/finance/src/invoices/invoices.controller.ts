import { Controller, Get, Post, Body, Headers, BadRequestException, Param, Delete, Res } from '@nestjs/common';
import type { Response } from 'express';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  async getInvoices(@Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    
    const invoices = await this.invoicesService.findAll(tenantId);
    
    // Seed some initial data if empty for demo purposes
    if (invoices.length === 0) {
      await this.invoicesService.create(tenantId, { amount: 1250.00, status: 'PAID' });
      await this.invoicesService.create(tenantId, { amount: 450.00, status: 'SENT' });
      await this.invoicesService.create(tenantId, { amount: 8900.00, status: 'DRAFT' });
      return this.invoicesService.findAll(tenantId);
    }
    
    return invoices;
  }

  @Post()
  async createInvoice(
    @Headers('x-tenant-id') tenantId: string,
    @Body() data: { amount: number, status?: string, lineItems?: any[] }
  ) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    return this.invoicesService.create(tenantId, data);
  }

  @Post(':id/send')
  async sendInvoice(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string
  ) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    return this.invoicesService.send(id, tenantId);
  }

  @Get(':id/pdf')
  async getInvoicePdf(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Res() res: Response
  ) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    try {
      const buffer = await this.invoicesService.generatePdf(id, tenantId);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    } catch (e) {
      throw new BadRequestException('Failed to generate PDF');
    }
  }

  @Delete(':id')
  async deleteInvoice(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string
  ) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    return this.invoicesService.delete(id, tenantId);
  }
}
