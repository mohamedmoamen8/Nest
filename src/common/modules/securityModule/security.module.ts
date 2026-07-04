import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TokenModule } from '../token/token.module';
import { DatabaseModule } from '../../../DB/database.module';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AuthorizationGuard } from '../../guards/authorition.guard';
import { JwtStrategy } from '../../strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TokenModule,
    DatabaseModule,
  ],
  providers: [JwtStrategy, JwtAuthGuard, AuthorizationGuard],
  exports: [PassportModule, TokenModule, JwtAuthGuard, AuthorizationGuard],
})
export class SecurityModule {}
