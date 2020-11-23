import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from './schemas/book.schema';
import { AuthorModule } from '../author/author.module';

import { GenreModule } from '../genre/genre.module';

@Module({
	imports: [
		MongooseModule.forFeature(
			[
				{ name: 'Book', schema: BookSchema }
			],
		),
		AuthorModule,
		GenreModule,
	],
	providers: [BookService],
	controllers: [BookController]
})
export class BookModule { }
