
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SLAService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.sLA.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.sLA.create({ data: { ...data, tenantId } });
  }
}
