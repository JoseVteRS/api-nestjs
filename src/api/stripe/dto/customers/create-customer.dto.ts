
import { IsString } from 'class-validator';


export class ICreateCustomer {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  description: string

}
