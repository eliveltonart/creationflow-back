import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  root() {
    return {
      status: 'ok',
      service: 'CreationFlow API',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
