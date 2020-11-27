import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(res, req): object {
    return {
      message: 'Nevook',
      res,
      req
    };
  }
}
