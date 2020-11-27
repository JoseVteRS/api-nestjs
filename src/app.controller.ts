import { Controller, Get, Request, Response } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(
    @Response() res: any, @Request() req: any): object {
    // res.cookie('XSRF-TOKEN', req.csrfToken());
    const hello = this.appService.getHello(res, req);
    return {
      hello
    }
  }
}
