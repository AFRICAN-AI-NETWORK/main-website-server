import { Module } from '@nestjs/common';
import { AiToolsController } from './ai-tools.controller';
import { AiToolsService } from './ai-tools.service';

@Module({
  controllers: [AiToolsController],
  providers: [AiToolsService],
})
export class AiToolsModule {}
