import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.from = config.get<string>('MAIL_FROM', '"E-Commerce" <no-reply@ecommerce.com>');

    this.transporter = nodemailer.createTransport({
      host: config.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: config.get<number>('MAIL_PORT', 587),
      secure: config.get<string>('MAIL_SECURE') === 'true',
      auth: {
        user: config.get<string>('MAIL_USER'),
        pass: config.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(options: MailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${options.to}`, err);
    }
  }

  async sendWelcomeEmail(to: string, username: string, verifyUrl: string): Promise<void> {
    await this.sendMail({
      to,
      subject: 'Welcome to E-Commerce – Verify your email',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
          <h2>Hi ${username}, welcome!</h2>
          <p>Thanks for signing up. Please verify your email address to activate your account.</p>
          <a href="${verifyUrl}"
             style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;
                    border-radius:6px;text-decoration:none;margin:16px 0">
            Verify Email
          </a>
          <p>This link expires in 24 hours.</p>
          <hr/>
          <small>If you didn't create an account, ignore this email.</small>
        </div>`,
    });
  }

  async sendPasswordResetEmail(to: string, username: string, resetUrl: string): Promise<void> {
    await this.sendMail({
      to,
      subject: 'E-Commerce – Password Reset Request',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
          <h2>Hi ${username},</h2>
          <p>We received a request to reset your password.</p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 24px;background:#DC2626;color:#fff;
                    border-radius:6px;text-decoration:none;margin:16px 0">
            Reset Password
          </a>
          <p>This link expires in 10 minutes.</p>
          <hr/>
          <small>If you didn't request a reset, ignore this email.</small>
        </div>`,
    });
  }
}
