import { Controller, Get, Headers, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('channels')
  async getChannels(@Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) throw new BadRequestException('x-tenant-id header is required');
    
    // Auto-create a general channel if none exist
    const count = await this.prisma.channel.count({ where: { tenantId } });
    if (count === 0) {
      await this.prisma.channel.create({
        data: {
          tenantId,
          name: 'general',
          isPrivate: false
        }
      });
    }

    return this.prisma.channel.findMany({
      where: { tenantId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: { user: true }
        }
      }
    });
  }
}
