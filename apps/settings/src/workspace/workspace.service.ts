import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(tenantId: string) {
    let settings = await this.prisma.workspaceSettings.findUnique({
      where: { tenantId }
    });

    if (!settings) {
      settings = await this.prisma.workspaceSettings.create({
        data: {
          tenantId,
          companyName: 'Acme Enterprise',
          primaryColor: '#3b82f6',
          timezone: 'UTC',
          currency: 'USD'
        }
      });
    }

    return settings;
  }

  async updateSettings(tenantId: string, data: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
    timezone?: string;
    currency?: string;
  }) {
    return this.prisma.workspaceSettings.upsert({
      where: { tenantId },
      update: data,
      create: {
        tenantId,
        companyName: data.companyName || 'Acme Enterprise',
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor || '#3b82f6',
        timezone: data.timezone || 'UTC',
        currency: data.currency || 'USD'
      }
    });
  }
}
