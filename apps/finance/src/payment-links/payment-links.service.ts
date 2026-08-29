
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentLinkService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.paymentLink.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.paymentLink.create({ data: { ...data, tenantId } });
  }
}
