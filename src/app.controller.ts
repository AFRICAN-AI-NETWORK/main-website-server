import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Used for health checks' })
  getHello(): { message: string } {
    return this.appService.getHello();
  }
}
