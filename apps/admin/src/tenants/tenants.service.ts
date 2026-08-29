import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Seed initial tenant for development if none exists
    const count = await this.prisma.tenant.count();
    if (count === 0) {
      await this.prisma.tenant.create({
        data: {
          id: 'tenant-1',
          name: 'Acme Corporation',
          domain: 'acme.crm.example.com',
        },
      });
      await this.prisma.tenant.create({
        data: {
          id: 'tenant-2',
          name: 'Globex Inc',
          domain: 'globex.crm.example.com',
        },
      });
    }
  }

  async findAll() {
    return this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { users: true, contacts: true, companies: true }
        }
      }
    });
  }

  async create(data: { name: string; domain?: string }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return this.prisma.tenant.create({
      data: {
        name: data.name,
        domain: data.domain || `${slug}.crm.example.com`,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.tenant.delete({
      where: { id },
    });
  }
}
