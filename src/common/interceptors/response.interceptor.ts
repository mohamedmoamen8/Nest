import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
  duration: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();
    const response = httpCtx.getResponse<{ statusCode: number }>();
    const startTime: number = (request as any).startTime ?? Date.now();

    return next.handle().pipe(
      map((data: any) => {
        const statusCode: number = response.statusCode ?? 200;

        let message = 'OK';
        let payload = data;

        if (data && typeof data === 'object' && 'message' in data) {
          message = data.message as string;
          const { message: _m, ...rest } = data as { message: string; [k: string]: unknown };
          payload = rest;
        }

        return {
          success: true,
          statusCode,
          message,
          data: payload,
          timestamp: new Date().toISOString(),
          path: request.url,
          duration: `${Date.now() - startTime}ms`,
        };
      }),
    );
  }
}
