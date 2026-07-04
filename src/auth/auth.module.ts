import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SecurityModule } from '../common/modules/securityModule/security.module';
import { DatabaseModule } from '../DB/database.module';
import { EmailService } from '../common/email/email.service';

@Module({
  imports: [SecurityModule, DatabaseModule],
  providers: [AuthService, EmailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
