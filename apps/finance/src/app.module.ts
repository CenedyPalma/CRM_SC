import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@repo/auth';
import { PriceBookController } from './price-books/price-books.controller';
import { PriceBookService } from './price-books/price-books.service';
import { QuoteController } from './quotes/quotes.controller';
import { QuoteService } from './quotes/quotes.service';
import { PaymentLinkController } from './payment-links/payment-links.controller';
import { PaymentLinkService } from './payment-links/payment-links.service';
import { SubscriptionController } from './subscriptions/subscriptions.controller';
import { SubscriptionService } from './subscriptions/subscriptions.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoicesModule } from './invoices/invoices.module';
import { PrismaModule } from './prisma/prisma.module';
import { KhataModule } from './khata/khata.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),InvoicesModule, PrismaModule, KhataModule],
  controllers: [PriceBookController, QuoteController, PaymentLinkController, SubscriptionController, AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },PriceBookService, QuoteService, PaymentLinkService, SubscriptionService, AppService],
})
export class AppModule {}
