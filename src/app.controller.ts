import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post('customers')
  async getStripe(
    @Body() body: any
  ) {
    const { name, email, description } = body
    const stripe = this.appService.createCustomer(name, email, description);
    return stripe
  }
}
