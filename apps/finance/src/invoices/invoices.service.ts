import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.invoice.findMany({
      where: { tenantId },
      include: { lineItems: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.invoice.findFirst({
      where: { id, tenantId },
      include: { lineItems: true }
    });
  }

  async create(tenantId: string, data: { amount: number, status?: string, dueDate?: Date, lineItems?: any[] }) {
    return this.prisma.invoice.create({
      data: {
        tenantId,
        invoiceNum: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        amount: data.amount,
        status: data.status || 'DRAFT',
        dueDate: data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        lineItems: {
          create: data.lineItems || []
        }
      },
      include: { lineItems: true }
    });
  }

  async update(id: string, tenantId: string, data: any) {
    return this.prisma.invoice.update({
      where: { id, tenantId },
      data,
      include: { lineItems: true }
    });
  }

  async delete(id: string, tenantId: string) {
    return this.prisma.invoice.deleteMany({
      where: { id, tenantId }
    });
  }

  async send(id: string, tenantId: string) {
    // In a real application, we would email the invoice here
    return this.update(id, tenantId, { status: 'SENT' });
  }

  async generatePdf(id: string, tenantId: string): Promise<Buffer> {
    const invoice = await this.findOne(id, tenantId);
    if (!invoice) throw new Error('Invoice not found');

    const PDFDocument = require('pdfkit');
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      doc.fontSize(25).text(`Invoice ${invoice.invoiceNum}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Status: ${invoice.status}`);
      doc.text(`Due Date: ${invoice.dueDate.toDateString()}`);
      doc.text(`Total Amount: $${invoice.amount.toFixed(2)}`);
      
      if (invoice.lineItems && invoice.lineItems.length > 0) {
        doc.moveDown();
        doc.fontSize(16).text('Line Items:', { underline: true });
        invoice.lineItems.forEach(item => {
          doc.fontSize(12).text(`${item.description} - ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${item.total.toFixed(2)}`);
        });
      }
      
      doc.end();
    });
  }
}
