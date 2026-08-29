
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.subscription.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.subscription.create({ data: { ...data, tenantId } });
  }
}
