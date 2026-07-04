import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('Validation failed: No body provided');
    }

    const object = plainToInstance(metadata.type, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = this.formatErrors(errors);
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: messages,
      });
    }

    return value;
  }

  private formatErrors(errors: ValidationError[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};

    for (const error of errors) {
      if (error.constraints) {
        formatted[error.property] = Object.values(error.constraints);
      }
    }

    return formatted;
  }
}
