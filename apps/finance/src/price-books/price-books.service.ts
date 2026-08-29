
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PriceBookService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.priceBook.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.priceBook.create({ data: { ...data, tenantId } });
  }
}
