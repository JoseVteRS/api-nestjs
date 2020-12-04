import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  async getHello(): Promise<any> {
    const nevook = await this.appService.getHello();
    return {
      nevook
    }
  }
}
