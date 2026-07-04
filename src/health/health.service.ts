import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealthStatus() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'Nest API',
      version: '1.0.0',
    };
  }

  getReadinessStatus() {
    return {
      ready: true,
      timestamp: new Date().toISOString(),
      checks: {
        database: 'OK',
        redis: 'OK',
        api: 'OK',
      },
    };
  }
}
