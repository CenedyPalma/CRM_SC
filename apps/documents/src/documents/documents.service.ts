import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, folderId?: string) {
    if (folderId === 'root') folderId = '';
    return this.prisma.document.findMany({
      where: {
        tenantId,
        folderId: folderId || null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { name: string; folderId?: string; mimeType?: string; size?: number; url?: string }, tenantId: string) {
    if (data.folderId === 'root') data.folderId = '';
    return this.prisma.document.create({
      data: {
        name: data.name,
        folderId: data.folderId || null,
        mimeType: data.mimeType || 'application/octet-stream',
        size: data.size || 1024,
        url: data.url || `https://storage.crm.example.com/${tenantId}/${data.name}`,
        tenantId,
      },
    });
  }

  async delete(id: string, tenantId: string) {
    return this.prisma.document.deleteMany({
      where: { id, tenantId },
    });
  }
}
