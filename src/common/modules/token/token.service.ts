import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '../../DB/redis.provider';
import { Redis } from 'ioredis';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  jti?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtExpiration: string;
  private readonly jwtRefreshExpiration: string;

  constructor(
    private configService: ConfigService,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {
    this.jwtSecret = configService.get<string>('JWT_SECRET') || 'your-secret-key';
    this.jwtRefreshSecret = configService.get<string>('JWT_REFRESH_SECRET') || 'your-refresh-secret';
    this.jwtExpiration = configService.get<string>('JWT_EXPIRATION') || '1h';
    this.jwtRefreshExpiration = configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
  }

  generatePair(payload: TokenPayload): TokenPair {
    const jti = this.generateJti();
    const payloadWithJti = { ...payload, jti };

    const accessToken = jwt.sign(payloadWithJti, this.jwtSecret, {
      expiresIn: this.jwtExpiration,
    });

    const refreshToken = jwt.sign(payloadWithJti, this.jwtRefreshSecret, {
      expiresIn: this.jwtRefreshExpiration,
    });

    return { accessToken, refreshToken };
  }

  verifyAccess(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  verifyRefresh(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.jwtRefreshSecret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  getJti(token: string): string {
    const decoded = jwt.decode(token) as any;
    return decoded?.jti || '';
  }

  async blacklist(jti: string): Promise<void> {
    const decoded = jwt.decode(jti, { complete: true }) as any;
    const expirationTime = decoded?.payload?.exp || Math.floor(Date.now() / 1000) + 3600;
    const ttl = Math.max(0, expirationTime - Math.floor(Date.now() / 1000));

    if (ttl > 0) {
      await this.redis.setex(`blacklist:${jti}`, ttl, '1');
    }
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    const result = await this.redis.exists(`blacklist:${jti}`);
    return result === 1;
  }

  private generateJti(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
