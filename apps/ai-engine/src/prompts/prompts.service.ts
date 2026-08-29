import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromptsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: any) {
    return this.prisma.aIPromptTemplate.create({
      data: {
        tenantId,
        name: data.name,
        prompt: data.prompt,
        model: data.model || 'gpt-4o'
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.aIPromptTemplate.findMany({
      where: { tenantId }
    });
  }

  async findOne(tenantId: string, id: string) {
    const prompt = await this.prisma.aIPromptTemplate.findFirst({
      where: { id, tenantId }
    });
    if (!prompt) throw new NotFoundException('Prompt Template not found');
    return prompt;
  }

  async update(tenantId: string, id: string, data: any) {
    const prompt = await this.findOne(tenantId, id);
    return this.prisma.aIPromptTemplate.update({
      where: { id: prompt.id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const prompt = await this.findOne(tenantId, id);
    return this.prisma.aIPromptTemplate.delete({
      where: { id: prompt.id },
    });
  }

  async askAI(tenantId: string, query: string, templateId?: string) {
    let systemPrompt = 'You are a helpful CRM assistant.';
    
    if (templateId) {
      const template = await this.findOne(tenantId, templateId);
      systemPrompt = template.prompt;
    }

    // Initialize OpenAI dynamically to avoid crashing if key is missing during boot
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Mocked LLM response for local testing without an API key
      return {
        reply: `[MOCKED AI RESPONSE] I am a simulated CRM assistant. You asked: "${query}". Please configure OPENAI_API_KEY for real responses.`,
        model: 'mock-gpt'
      };
    }

    try {
      const { OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey });
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
      });

      return {
        reply: response.choices[0].message.content,
        model: response.model,
        usage: response.usage
      };
    } catch (error) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }
}
