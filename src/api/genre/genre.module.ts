import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreSchema } from './schemas/genre.schema';
import { UserSchema } from '../user/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: 'Genre', schema: GenreSchema },
				{ name: 'User', schema: UserSchema },
			],
			'book'
		),
		PassportModule,
	],
	controllers: [GenreController],
	providers: [GenreService]
})
export class GenreModule { }
