import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@repo/auth';
import { ChatWidgetController } from './chat-widgets/chat-widgets.controller';
import { ChatWidgetService } from './chat-widgets/chat-widgets.service';
import { SLAController } from './slas/slas.controller';
import { SLAService } from './slas/slas.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketsModule } from './tickets/tickets.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),TicketsModule, PrismaModule],
  controllers: [ChatWidgetController, SLAController, AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },ChatWidgetService, SLAService, AppService],
})
export class AppModule {}
