import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.landingPage.findMany({
      where: { tenantId },
      include: { blocks: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async findOne(tenantId: string, id: string) {
    const page = await this.prisma.landingPage.findFirst({
      where: { id, tenantId },
      include: { blocks: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async findBySlug(slug: string) {
    // Public endpoint logic (no tenant check needed for public slugs as long as published)
    const page = await this.prisma.landingPage.findFirst({
      where: { slug, published: true },
      include: { blocks: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }

  async create(tenantId: string, data: any) {
    return this.prisma.landingPage.create({
      data: {
        tenantId,
        title: data.title,
        slug: data.slug,
        published: data.published || false,
      },
    });
  }

  async updateBlocks(tenantId: string, id: string, blocks: any[]) {
    await this.findOne(tenantId, id); // Ensure it exists
    
    // Delete existing blocks
    await this.prisma.pageBlock.deleteMany({
      where: { landingPageId: id },
    });
    
    // Create new blocks
    if (blocks && blocks.length > 0) {
      await this.prisma.pageBlock.createMany({
        data: blocks.map((b, idx) => ({
          landingPageId: id,
          type: b.type,
          content: b.content,
          orderIndex: idx,
        })),
      });
    }
    
    return this.findOne(tenantId, id);
  }
}
