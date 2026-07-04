import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class SanitizeUsernamePipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata): string {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('Username must be a valid non-empty string');
    }
    return value.trim().toLowerCase();
  }
}
