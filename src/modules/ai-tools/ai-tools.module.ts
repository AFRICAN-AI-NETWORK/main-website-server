import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiToolsController } from './ai-tools.controller';
import { AiToolsService } from './ai-tools.service';

@Module({
  imports: [PrismaModule],
  controllers: [AiToolsController],
  providers: [AiToolsService],
})
export class AiToolsModule {}
