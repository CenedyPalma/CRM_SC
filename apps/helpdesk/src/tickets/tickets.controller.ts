import { Controller, Get, Post, Body, Headers, BadRequestException, Param, Patch } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async getTickets(@Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    
    const tickets = await this.ticketsService.findAll(tenantId);
    
    // Seed some initial data if empty for demo purposes
    if (tickets.length === 0) {
      await this.ticketsService.create(tenantId, { title: "Cannot access billing portal", description: "When I click billing, it shows a 404 error page.", priority: "HIGH" });
      await this.ticketsService.create(tenantId, { title: "How do I invite team members?", description: "I don't see an option to add more users.", priority: "MEDIUM" });
      const t3 = await this.ticketsService.create(tenantId, { title: "Custom domain setup", description: "Need help configuring DNS records.", priority: "LOW" });
      await this.ticketsService.updateStatus(t3.id, "RESOLVED");
      
      return this.ticketsService.findAll(tenantId);
    }
    
    return tickets;
  }

  @Post()
  async createTicket(
    @Headers('x-tenant-id') tenantId: string,
    @Body() data: { title: string, description: string, priority?: string }
  ) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    return this.ticketsService.create(tenantId, data);
  }

  @Post(':id/messages')
  async addMessage(
    @Param('id') id: string,
    @Body() data: { content: string, isStaff?: boolean }
  ) {
    return this.ticketsService.addMessage(id, data.content, data.isStaff);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { status: string }
  ) {
    return this.ticketsService.updateStatus(id, data.status);
  }
}
