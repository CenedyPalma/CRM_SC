import { Module } from '@nestjs/common';
import { KhataController } from './khata.controller';
import { KhataService } from './khata.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KhataController],
  providers: [KhataService],
})
export class KhataModule {}
