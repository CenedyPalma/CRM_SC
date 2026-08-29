import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@repo/auth';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),PrismaModule, ApiKeysModule, WebhooksModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },AppService],
})
export class AppModule {}
