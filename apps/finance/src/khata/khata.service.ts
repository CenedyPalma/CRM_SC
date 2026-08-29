import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KhataService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalanceForContact(tenantId: string, contactId: string) {
    // In a full implementation we would aggregate Transactions:
    // const transactions = await this.prisma.transaction.findMany({ where: { contactId, tenantId }});
    // For now we mock the balance calculation logic:
    return {
      contactId,
      balance: -250.00,
      currency: 'USD',
      dueSince: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'OVERDUE'
    };
  }
}
