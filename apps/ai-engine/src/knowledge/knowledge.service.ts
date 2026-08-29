import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async generateEmbeddings(text: string): Promise<number[]> {
    try {
      // Use dynamic import because transformers is an ESM module
      const { pipeline } = await import('@xenova/transformers');
      
      // Load the feature extraction pipeline (this caches the model locally)
      const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      
      // Compute embeddings
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    } catch (e) {
      this.logger.error('Failed to generate embeddings via Xenova/transformers. Falling back to mock.', e);
      return Array.from({ length: 384 }).map(() => Math.random());
    }
  }

  async create(tenantId: string, data: any) {
    const vector = await this.generateEmbeddings(data.content);

    return this.prisma.knowledgeBaseDocument.create({
      data: {
        tenantId,
        title: data.title,
        content: data.content,
        // Using stringified vector for now, in production use pgvector extensions
        vectorEmbeddings: vector
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.knowledgeBaseDocument.findMany({
      where: { tenantId }
    });
  }

  async findOne(tenantId: string, id: string) {
    const doc = await this.prisma.knowledgeBaseDocument.findFirst({
      where: { id, tenantId }
    });
    if (!doc) throw new NotFoundException('Knowledge Base Document not found');
    return doc;
  }

  async update(tenantId: string, id: string, data: any) {
    const doc = await this.findOne(tenantId, id);
    let updateData: any = { title: data.title, content: data.content };
    
    if (data.content) {
      updateData.vectorEmbeddings = await this.generateEmbeddings(data.content);
    }

    return this.prisma.knowledgeBaseDocument.update({
      where: { id: doc.id },
      data: updateData,
    });
  }

  async remove(tenantId: string, id: string) {
    const doc = await this.findOne(tenantId, id);
    return this.prisma.knowledgeBaseDocument.delete({
      where: { id: doc.id },
    });
  }
}
