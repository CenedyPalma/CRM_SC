
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompliancePolicyService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.compliancePolicy.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.compliancePolicy.create({ data: { ...data, tenantId } });
  }
}
