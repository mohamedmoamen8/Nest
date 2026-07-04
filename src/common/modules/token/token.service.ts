import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../../DB/redis.provider';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  jti: string;
}

@Injectable()
export class TokenService {
  private readonly BLACKLIST_TTL: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {
    this.BLACKLIST_TTL = this.parseTtl(
      config.get<string>('JWT_ACCESS_EXPIRES', '15m'),
    );
  }

  generatePair(payload: { sub: string; email: string; role: string }): TokenPair {
    const accessToken = this.jwtService.sign(
      { ...payload, jti: uuidv4() },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES', '15m') as any,
      },
    );

    const refreshToken = this.jwtService.sign(
      { ...payload, jti: uuidv4() },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES', '7d') as any,
      },
    );

    return { accessToken, refreshToken };
  }

  verifyAccess(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  verifyRefresh(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  decode(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }

  getJti(token: string): string {
    return this.decode(token)?.jti;
  }

  async blacklist(jti: string): Promise<void> {
    await this.redis.set(`blacklist:${jti}`, '1', 'EX', this.BLACKLIST_TTL);
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    const val = await this.redis.get(`blacklist:${jti}`);
    return !!val;
  }

  private parseTtl(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1), 10);
    const map: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
    return value * (map[unit] ?? 60);
  }
}
