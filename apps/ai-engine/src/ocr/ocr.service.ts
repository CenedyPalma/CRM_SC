import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
    });
  }

  /**
   * Processes a base64 image or image URL and returns parsed data + inferred schema.
   */
  async parseInvoiceAndInferSchema(imageUrlOrBase64: string) {
    this.logger.log('Processing document for OCR and schema inference...');
    
    if (!process.env.OPENAI_API_KEY) {
      this.logger.warn('No OPENAI_API_KEY found, returning mock data.');
      return this.getMockResponse();
    }

    try {
      // In production, we'd use gpt-4o for vision
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an intelligent document parser. Extract the structured data from this document. 
            Additionally, infer a generalized database schema for storing this type of document. 
            Return the output STRICTLY in the following JSON format:
            {
              "schema": {
                "name": "Display Name of the Entity (e.g. Invoice)",
                "apiName": "database_safe_name",
                "description": "Short description",
                "fields": [
                  { "name": "Field Name", "apiName": "field_name", "fieldType": "TEXT|NUMBER|DATE|BOOLEAN" }
                ]
              },
              "data": {
                "field_name": "extracted_value"
              }
            }`
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Parse this document and infer the schema.' },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrlOrBase64,
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      });

      const resultText = response.choices[0].message.content;
      return JSON.parse(resultText || '{}');
    } catch (error) {
      this.logger.error('Error parsing document with OpenAI', error);
      throw new Error('Failed to parse document');
    }
  }

  private getMockResponse() {
    return {
      schema: {
        name: "Supplier Invoice",
        apiName: "supplier_invoice",
        description: "Invoices received from suppliers for inventory.",
        fields: [
          { name: "Invoice Number", apiName: "invoice_number", fieldType: "TEXT" },
          { name: "Date", apiName: "date", fieldType: "DATE" },
          { name: "Total Amount", apiName: "total_amount", fieldType: "NUMBER" },
          { name: "Supplier Name", apiName: "supplier_name", fieldType: "TEXT" }
        ]
      },
      data: {
        invoice_number: "INV-2026-0814",
        date: "2026-08-01",
        total_amount: 1450.50,
        supplier_name: "Acme Supermarket Suppliers"
      }
    };
  }
}
