import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { RedisModule } from '../redis/redis.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  providers: [UploadService],
  controllers: [UploadController],
  imports: [
    MulterModule.register({
      dest: `./uploads`,
    }),
    RedisModule,
  ],
})
export class UploadModule {}
