import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: any) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = data.password ? await bcrypt.hash(data.password, salt) : undefined;
    
    // Auto-create tenant if missing (simplified for the demo)
    let tenantId = data.tenantId || 'default-tenant';
    
    // Ensure tenant exists
    await this.prisma.tenant.upsert({
      where: { id: tenantId },
      update: {},
      create: { id: tenantId, name: 'Default Tenant' }
    });

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        tenantId,
        role: data.role || 'USER',
      },
    });
  }
}
