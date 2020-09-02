import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { AuthorSchema } from './schemas/author.schema';
import { UserSchema } from '../user/schemas/user.schema';


@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: 'Author', schema: AuthorSchema },
				{ name: 'User', schema: UserSchema },
			],
			'book'
		),

		PassportModule,
	],
	providers: [AuthorService],
	controllers: [AuthorController],
})
export class AuthorModule { }