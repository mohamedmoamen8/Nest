import { Provider } from '@nestjs/common';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>('REDIS_HOST') || 'localhost',
      port: configService.get<number>('REDIS_PORT') || 6379,
      password: configService.get<string>('REDIS_PASSWORD'),
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
  },
  inject: [ConfigService],
};
