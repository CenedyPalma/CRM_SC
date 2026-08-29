
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocalizationService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.localization.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.localization.create({ data: { ...data, tenantId } });
  }
}
