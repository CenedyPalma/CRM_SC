import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PluginsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Seed mock plugins for the store
    const count = await this.prisma.plugin.count();
    if (count === 0) {
      await this.prisma.plugin.createMany({
        data: [
          { name: 'Advanced CRM', description: 'Enterprise CRM features including forecasting.', version: '2.0.0', price: 99 },
          { name: 'Email Marketing', description: 'Campaign builder and mass emailing.', version: '1.5.0', price: 49 },
          { name: 'AI Sales Assistant', description: 'AI-powered meeting summarizer and lead scoring.', version: '1.0.0', price: 149 },
          { name: 'Slack Integration', description: 'Connect workflows directly to Slack channels.', version: '1.2.1', price: 0 },
        ],
      });
    }
  }

  async findAll(tenantId: string) {
    const plugins = await this.prisma.plugin.findMany();
    const installed = await this.prisma.installedPlugin.findMany({
      where: { tenantId }
    });
    
    return plugins.map(plugin => ({
      ...plugin,
      isInstalled: installed.some(ip => ip.pluginId === plugin.id),
      installedAt: installed.find(ip => ip.pluginId === plugin.id)?.createdAt
    }));
  }

  async install(tenantId: string, pluginId: string) {
    // Upsert installed plugin
    const installed = await this.prisma.installedPlugin.findFirst({
      where: { tenantId, pluginId }
    });
    
    if (!installed) {
      return this.prisma.installedPlugin.create({
        data: { tenantId, pluginId }
      });
    }
    return installed;
  }

  async uninstall(tenantId: string, pluginId: string) {
    return this.prisma.installedPlugin.deleteMany({
      where: { tenantId, pluginId }
    });
  }
}
