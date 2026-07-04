import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { AuthorizationGuard } from '../common/guards/authorition.guard';
import { CurrentUser, Public, Roles } from '../common/decorators/auth.decorators';
import { SanitizeInputPipe } from './pipes/validation.pipe';

@Controller('auth')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new SanitizeInputPipe(),
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )
  async signup(@Body() dto: SignupDto) {
    const { user, tokens } = await this.authService.signup(dto);
    return {
      message: 'Account created successfully',
      tokens,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    };
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new SanitizeInputPipe(), new ValidationPipe({ whitelist: true }))
  async signin(@Body() dto: LoginDto) {
    const { user, tokens } = await this.authService.signin(dto);
    return {
      message: 'Signed in successfully',
      tokens,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async refresh(@Body() dto: RefreshTokenDto) {
    const tokens = await this.authService.refresh(dto.refreshToken);
    return { message: 'Tokens refreshed successfully', tokens };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: any) {
    const jti: string = user?.jti ?? '';
    await this.authService.logout(user._id.toString(), jti);
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  getMe(@CurrentUser() user: any) {
    return {
      message: 'Profile fetched successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    };
  }

  @Get('admin-only')
  @Roles('admin')
  adminOnly(@CurrentUser() user: any) {
    return {
      message: 'Admin area accessed',
      user: { id: user._id, role: user.role },
    };
  }
}
