import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordStrengthPipe implements PipeTransform {
  private readonly STRONG_PASSWORD =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

  transform(value: any, _metadata: ArgumentMetadata): string {
    if (typeof value !== 'string' || !value) {
      throw new BadRequestException('Password must be a non-empty string');
    }

    if (!this.STRONG_PASSWORD.test(value)) {
      throw new BadRequestException(
        'Password must be 8-32 characters and include uppercase, lowercase, digit, and special character (@$!%*?&)',
      );
    }

    return value;
  }
}
