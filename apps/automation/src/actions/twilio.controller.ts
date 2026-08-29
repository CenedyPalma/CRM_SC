import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Controller('actions/twilio')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('whatsapp')
  async sendWhatsApp(
    @Body() body: { to: string; message: string; contactId?: string },
    @Req() req: any,
  ) {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    await this.twilioService.sendWhatsAppMessage(body.to, body.message);
    
    // In a complete flow, we would also inject an 'Activity' of type 'WHATSAPP' 
    // into the contact's timeline here via the CRM service.
    
    return { success: true };
  }
}
