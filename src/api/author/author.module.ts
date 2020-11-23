import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { AuthorSchema } from './schemas/author.schema';

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: 'Author', schema: AuthorSchema },
			],
		),
		PassportModule,
	],
	providers: [AuthorService],
	controllers: [AuthorController],
	exports: [AuthorService]
})
export class AuthorModule { }