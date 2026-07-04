import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from './user.schema';
import { UserRepository } from '../repo/user.repository';
import { RedisProvider, REDIS_CLIENT } from './redis.provider';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
        connectionFactory: (connection) => {
          connection.on('connected', () => console.log('✅ MongoDB connected'));
          connection.on('error', (err: Error) => console.error('❌ MongoDB error:', err.message));
          return connection;
        },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository, RedisProvider],
  exports: [UserRepository, REDIS_CLIENT, MongooseModule],
})
export class DatabaseModule {}
