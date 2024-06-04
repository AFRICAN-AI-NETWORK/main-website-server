import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const RedisProvider = (): Provider<Redis> => {
  let redisClient: Redis;

  return {
    provide: 'REDIS_PROVIDER',
    useFactory: (configService: ConfigService) => {
      redisClient = new Redis({
        password: configService.get('REDIS_PASSWORD'),
        host: configService.get('REDIS_HOST'),
        port: Number(configService.get('REDIS_PORT')),
      });
      redisClient.on('error', (err) =>
        console.error('Redis Client Error', err),
      );

      return redisClient;
    },
    inject: [ConfigService],
  };
};
