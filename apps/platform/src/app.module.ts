import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@repo/auth';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomObjectsModule } from './custom-objects/custom-objects.module';
import { CustomFieldsModule } from './custom-fields/custom-fields.module';
import { CustomRecordsModule } from './custom-records/custom-records.module';
import { PrismaModule } from './prisma/prisma.module';
import { AutomationsModule } from './automations/automations.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),CustomObjectsModule, CustomFieldsModule, CustomRecordsModule, PrismaModule, AutomationsModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },AppService],
})
export class AppModule {}
