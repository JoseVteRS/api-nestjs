import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { StripeService } from './stripe.service';


@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @Post()
  create(@Body() createStripeDto) {
    return this.stripeService.create(createStripeDto);
  }

  @Get()
  findAll() {
    return this.stripeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stripeService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStripeDto) {
    return this.stripeService.update(+id, updateStripeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stripeService.remove(+id);
  }
}
