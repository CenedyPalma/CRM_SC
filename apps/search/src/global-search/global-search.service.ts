import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SearchResult {
  id: string;
  type: 'CONTACT' | 'DEAL' | 'TICKET' | 'EMPLOYEE' | 'PROJECT';
  title: string;
  subtitle?: string;
  url: string;
}

@Injectable()
export class GlobalSearchService {
  constructor(private prisma: PrismaService) {}

  async search(tenantId: string, query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    const searchTerms = query.split(' ').filter(t => t.length > 0);
    const results: SearchResult[] = [];

    // Simple implementation of federated search
    // In production, this would be an Elasticsearch query or Postgres FTS
    
    // 1. Search Contacts
    const contacts = await this.prisma.contact.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: 5
    });
    results.push(...contacts.map(c => ({
      id: c.id,
      type: 'CONTACT' as const,
      title: `${c.firstName} ${c.lastName}`,
      subtitle: c.email || undefined,
      url: `/?contactId=${c.id}`
    })));

    // 2. Search Deals
    const deals = await this.prisma.deal.findMany({
      where: {
        tenantId,
        title: { contains: query, mode: 'insensitive' }
      },
      take: 5
    });
    results.push(...deals.map(d => ({
      id: d.id,
      type: 'DEAL' as const,
      title: d.title,
      subtitle: `Value: $${d.amount}`,
      url: `/deals?id=${d.id}`
    })));

    // 3. Search Tickets
    const tickets = await this.prisma.ticket.findMany({
      where: {
        tenantId,
        title: { contains: query, mode: 'insensitive' }
      },
      take: 5
    });
    results.push(...tickets.map(t => ({
      id: t.id,
      type: 'TICKET' as const,
      title: t.title,
      subtitle: `Status: ${t.status}`,
      url: `/tickets?id=${t.id}`
    })));

    // 4. Search Employees
    const employees = await this.prisma.employee.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5
    });
    results.push(...employees.map(e => ({
      id: e.id,
      type: 'EMPLOYEE' as const,
      title: `${e.firstName} ${e.lastName}`,
      subtitle: e.jobTitle || 'Employee',
      url: `/directory`
    })));

    return results;
  }
}
