import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '../common/decorators';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async checkHealth() {
    return this.healthService.getHealthStatus();
  }

  @Public()
  @Get('ready')
  @HttpCode(HttpStatus.OK)
  async checkReadiness() {
    return this.healthService.getReadinessStatus();
  }
}
