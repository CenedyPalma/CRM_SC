import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  create(tenantId: string, data: any) {
    return this.prisma.contact.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  findAll(tenantId: string) {
    return this.prisma.contact.findMany({
      where: { tenantId },
      include: { company: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(tenantId: string, id: string) {
    return this.prisma.contact.findUnique({
      where: { id, tenantId },
      include: { company: true }
    });
  }

  update(tenantId: string, id: string, data: any) {
    return this.prisma.contact.update({
      where: { id, tenantId },
      data,
    });
  }

  remove(tenantId: string, id: string) {
    return this.prisma.contact.delete({
      where: { id, tenantId },
    });
  }
}
