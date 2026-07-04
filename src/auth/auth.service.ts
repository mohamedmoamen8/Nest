import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../repo/user.repository';
import { UserDocument } from '../DB/user.schema';
import { EmailService } from '../common/email/email.service';
import { TokenService, TokenPair } from '../common/modules/token/token.service';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<{ user: UserDocument; tokens: TokenPair }> {
    const emailExists = await this.userRepo.exists({ email: dto.email });
    if (emailExists) {
      throw new ConflictException('Email is already registered');
    }

    const usernameExists = await this.userRepo.exists({ username: dto.username });
    if (usernameExists) {
      throw new ConflictException('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const user = await this.userRepo.create({ ...dto, password: hashedPassword });

    const tokens = this.tokenService.generatePair({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await this.userRepo.updateById(user._id.toString(), {
      refreshTokenJti: this.tokenService.getJti(tokens.refreshToken),
    });

    void this.emailService.sendWelcomeEmail(
      user.email,
      user.username,
      `${this.config.get('APP_URL', 'http://localhost:3000')}/auth/verify-email`,
    );

    return { user, tokens };
  }

  async signin(dto: LoginDto): Promise<{ user: UserDocument; tokens: TokenPair }> {
    const user = await this.userRepo.findByEmail(dto.email, { includePassword: true });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = this.tokenService.generatePair({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await this.userRepo.updateById(user._id.toString(), {
      refreshTokenJti: this.tokenService.getJti(tokens.refreshToken),
    });

    return { user, tokens };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const payload = this.tokenService.verifyRefresh(refreshToken);

    const isBlacklisted = await this.tokenService.isBlacklisted(payload.jti);
    if (isBlacklisted) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const user = await this.userRepo.findById(payload.sub, { includeJti: true });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or deactivated');
    }

    if (user.refreshTokenJti !== payload.jti) {
      await this.userRepo.updateById(user._id.toString(), { refreshTokenJti: null });
      throw new UnauthorizedException('Token reuse detected. Please sign in again');
    }

    await this.tokenService.blacklist(payload.jti);

    const tokens = this.tokenService.generatePair({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await this.userRepo.updateById(user._id.toString(), {
      refreshTokenJti: this.tokenService.getJti(tokens.refreshToken),
    });

    return tokens;
  }

  async logout(userId: string, accessTokenJti: string): Promise<void> {
    await this.tokenService.blacklist(accessTokenJti);
    await this.userRepo.updateById(userId, { refreshTokenJti: null });
  }
}
