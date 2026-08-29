import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('process-document')
  async processDocument(
    @Body() body: { imageUrl: string; base64Data: string },
    @Req() req: any,
  ) {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    const source = body.base64Data || body.imageUrl;
    if (!source) {
      return { error: 'No image source provided (imageUrl or base64Data required)' };
    }

    const result = await this.ocrService.parseInvoiceAndInferSchema(source);
    
    // In a complete flow, we would automatically contact the platform API
    // to create the CustomObject (result.schema) and CustomRecord (result.data).
    // For now, we return the parsed data and inferred schema back to the frontend
    // so the user can review and approve it.
    
    return {
      success: true,
      tenantId,
      ...result
    };
  }
}
