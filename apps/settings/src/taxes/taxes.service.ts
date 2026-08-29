
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaxRuleService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.taxRule.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.taxRule.create({ data: { ...data, tenantId } });
  }
}
