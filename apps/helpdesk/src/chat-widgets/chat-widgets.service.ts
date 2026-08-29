
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatWidgetService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.chatWidget.findMany({ where: { tenantId } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.chatWidget.create({ data: { ...data, tenantId } });
  }
}
