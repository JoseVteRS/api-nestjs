import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreSchema } from './schemas/genre.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: 'Genre', schema: GenreSchema },
			],
		),
		PassportModule,
	],
	controllers: [GenreController],
	providers: [GenreService],
	exports: [GenreService]
})
export class GenreModule { }
