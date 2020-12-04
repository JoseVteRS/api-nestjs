import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

@Injectable()
export class AppService {
  constructor(@InjectStripe() private readonly stripeClient: Stripe) { }
  getHello(): any {
    return {
      message: 'Nevook',
    };
  }

  createCustomer(name: string, email: string, description: string) {
    const customers = this.stripeClient.customers;
    customers.create({
      name: name,
      email: email,
      description: description
    })
  }
}
