import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.activity.create({
      data: {
        tenantId,
        type: data.type,
        title: data.title,
        content: data.content,
        contactId: data.contactId,
        companyId: data.companyId,
        dealId: data.dealId,
        userId: data.userId,
      },
    });
  }

  async findAll(tenantId: string, query: any) {
    const where: any = { tenantId };
    if (query.contactId) where.contactId = query.contactId;
    if (query.companyId) where.companyId = query.companyId;
    if (query.dealId) where.dealId = query.dealId;
    
    const activities = await this.prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // In a fully developed Universal Timeline, we would query the Automation Service 
    // for WhatsApp logs and the Finance Service for Khata payments, then merge them here.
    // Simulating that aggregation:
    const mockAggregated = [
      {
        id: 'mock-whatsapp-1',
        type: 'WHATSAPP',
        title: 'Auto-Follow Up',
        content: 'Sent automated WhatsApp reminder about overdue balance.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'mock-khata-1',
        type: 'KHATA_PAYMENT',
        title: 'Payment Received',
        content: 'Received $50.00 cash payment against ledger.',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    return [...activities, ...mockAggregated].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findOne(tenantId: string, id: string) {
    const activity = await this.prisma.activity.findFirst({
      where: { id, tenantId }
    });
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async remove(tenantId: string, id: string) {
    const activity = await this.findOne(tenantId, id);
    return this.prisma.activity.delete({
      where: { id: activity.id },
    });
  }
}
