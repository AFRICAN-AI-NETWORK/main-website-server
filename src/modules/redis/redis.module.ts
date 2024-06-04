import { Module } from '@nestjs/common';
import { RedisProvider } from './redis.provider';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisProvider(), RedisService],
  exports: ['REDIS_PROVIDER', RedisService],
})
export class RedisModule {}
