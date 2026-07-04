import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class SanitizeInputPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type === 'param' || metadata.type === 'query') {
      if (value === null || value === undefined) return value;
      if (typeof value !== 'string') {
        throw new BadRequestException(`${metadata.data} must be a string`);
      }
      return value.trim().toLowerCase();
    }

    if (metadata.type === 'body' && value && typeof value === 'object') {
      return this.sanitizeObject(value);
    }

    return value;
  }

  private sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string') {
        result[key] = val.trim();
      } else if (Array.isArray(val)) {
        result[key] = val.map((item) =>
          typeof item === 'string' ? item.trim() : item,
        );
      } else if (val && typeof val === 'object') {
        result[key] = this.sanitizeObject(val);
      } else {
        result[key] = val;
      }
    }
    return result;
  }
}
