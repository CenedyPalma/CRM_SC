import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@repo/auth';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { CompaniesModule } from './companies/companies.module';
import { PrismaModule } from './prisma/prisma.module';
import { ActivitiesModule } from './activities/activities.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),ContactsModule, CompaniesModule, PrismaModule, ActivitiesModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },AppService],
})
export class AppModule {}
