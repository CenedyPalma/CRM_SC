import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@repo/auth';
import { ESignatureController } from './e-signatures/e-signatures.controller';
import { ESignatureService } from './e-signatures/e-signatures.service';
import { S3UploadController } from './s3-uploads/s3-uploads.controller';
import { S3UploadService } from './s3-uploads/s3-uploads.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FoldersModule } from './folders/folders.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),PrismaModule, FoldersModule, DocumentsModule],
  controllers: [ESignatureController, S3UploadController, AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },ESignatureService, S3UploadService, AppService],
})
export class AppModule {}
