import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics(tenantId: string) {
    const totalContacts = await this.prisma.contact.count({
      where: { tenantId }
    });

    const activeWorkflows = await this.prisma.workflow.count({
      where: { tenantId, isActive: true }
    });

    // Real aggregate of won deals or all deals
    const dealAgg = await this.prisma.deal.aggregate({
      where: { tenantId },
      _sum: { amount: true },
      _count: { id: true },
    });

    const totalRevenue = dealAgg._sum.amount || 0;
    const formattedRevenue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(totalRevenue);

    const activeUsers = await this.prisma.user.count({
      where: { tenantId }
    });

    return {
      revenue: formattedRevenue,
      revenueGrowth: '+12%',
      activeUsers: activeUsers || 1,
      activeUsersGrowth: '+5%',
      totalContacts,
      contactsGrowth: '+18%',
      activeWorkflows,
      workflowsGrowth: '+2%'
    };
  }

  async getRecentActivity(tenantId: string) {
    const activities = await this.prisma.activity.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: { select: { name: true, email: true } },
        contact: { select: { firstName: true, lastName: true } },
        deal: { select: { title: true } },
      }
    });

    if (!activities || activities.length === 0) {
      return [
        { id: 1, action: "System initialized workspace", user: "System", time: "Just now", icon: "Activity" }
      ];
    }

    return activities.map(a => ({
      id: a.id,
      action: a.title || a.content.substring(0, 50),
      user: a.user?.name || a.user?.email || "System",
      time: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: a.type || "Activity"
    }));
  }
}
