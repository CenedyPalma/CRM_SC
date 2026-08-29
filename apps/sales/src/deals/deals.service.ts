import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  create(tenantId: string, data: any) {
    return this.prisma.deal.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  findAll(tenantId: string) {
    return this.prisma.deal.findMany({
      where: { tenantId },
      include: { company: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(tenantId: string, id: string) {
    return this.prisma.deal.findUnique({
      where: { id, tenantId },
      include: { company: true }
    });
  }

  update(tenantId: string, id: string, data: any) {
    return this.prisma.deal.update({
      where: { id, tenantId },
      data,
    });
  }

  remove(tenantId: string, id: string) {
    return this.prisma.deal.delete({
      where: { id, tenantId },
    });
  }
}
