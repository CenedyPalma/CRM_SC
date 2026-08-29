import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@repo/auth';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromptsModule } from './prompts/prompts.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { PrismaModule } from './prisma/prisma.module';
import { OcrModule } from './ocr/ocr.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),PromptsModule, KnowledgeModule, PrismaModule, OcrModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },AppService],
})
export class AppModule {}
