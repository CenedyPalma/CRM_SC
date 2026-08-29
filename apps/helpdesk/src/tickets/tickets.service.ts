import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.ticket.findMany({
      where: { tenantId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(tenantId: string, data: { title: string, description: string, priority?: string }) {
    return this.prisma.ticket.create({
      data: {
        tenantId,
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        status: 'OPEN',
        messages: {
          create: {
            content: data.description,
            isStaff: false
          }
        }
      },
      include: { messages: true }
    });
  }

  async addMessage(ticketId: string, content: string, isStaff: boolean = false) {
    return this.prisma.ticketMessage.create({
      data: {
        ticketId,
        content,
        isStaff
      }
    });
  }

  async updateStatus(ticketId: string, status: string) {
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status }
    });
  }
}
