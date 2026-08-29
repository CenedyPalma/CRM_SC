
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportTemplateService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.reportTemplate.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.reportTemplate.create({ data: { ...data, tenantId } });
  }
}
