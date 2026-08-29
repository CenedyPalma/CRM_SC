import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.apiKey.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { name: string; permissions?: string[] }, tenantId: string) {
    // Generate a secure random key
    const rawKey = 'sk_live_' + crypto.randomBytes(24).toString('hex');
    
    // Hash the key for storage
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');
    
    // Store only the hash
    await this.prisma.apiKey.create({
      data: {
        name: data.name,
        key: hashedKey, // We use the schema's existing 'key' field to store the hash
        permissions: data.permissions || ['read', 'write'],
        tenantId,
      },
    });
    
    // We only ever return the unmasked key ONCE during creation
    return {
      name: data.name,
      key: rawKey,
      permissions: data.permissions || ['read', 'write'],
      tenantId
    };
  }

  async delete(id: string, tenantId: string) {
    return this.prisma.apiKey.deleteMany({
      where: { id, tenantId },
    });
  }
}
