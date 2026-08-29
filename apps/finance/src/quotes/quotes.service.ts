
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuoteService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.quote.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.quote.create({ data: { ...data, tenantId } });
  }
}
