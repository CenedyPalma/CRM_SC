import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, applyAuditMiddleware } from '@repo/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    applyAuditMiddleware(this);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
