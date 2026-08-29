import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@repo/auth';
import { SearchIndexController } from './search-index/search-index.controller';
import { SearchIndexService } from './search-index/search-index.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalSearchModule } from './global-search/global-search.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'super-secret-business-os-key' }),GlobalSearchModule, PrismaModule],
  controllers: [SearchIndexController, AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },SearchIndexService, AppService],
})
export class AppModule {}
