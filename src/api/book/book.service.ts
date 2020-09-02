import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as stringSimilarity from 'string-similarity'

import { Book } from './interfaces/book.interface';
import { CreateBookDto } from './dtos/create-book.dto';
import { slugifyData } from '../../utils/slugifyData';

@Injectable()
export class BookService {
	constructor(
		@InjectModel('Book') private readonly bookModel: Model<Book>
	) { }

	public async createOne(user: any, dto: CreateBookDto) {

		const books = await this.bookModel.find();

		books.map( (book) => {
			const sim = stringSimilarity.compareTwoStrings(dto.title, book.title)
			console.log({sim: sim, dtoTitle: dto.title, book: book.title})
			if(sim >= 0.8) {
				console.log('El libro se ha guardado igualmente. Pero revísa si existe o es algún muy parecido')

			}
		})



		const titleSlugified = slugifyData(dto.title)
		if (dto.slug === undefined) {
			const checkBook = await this.bookModel.findOne({ slug: titleSlugified })
			if (checkBook) {
				throw new BadRequestException(`El libro ${dto.title} ya existe. Revisa el slug y el título por favor`)
			}
			dto.slug = titleSlugified
		}

		if (dto.slug !== undefined) {
			const checkBook = await this.bookModel.findOne({ slug: dto.slug })
			if (checkBook) {
				throw new BadRequestException(`El libro ${dto.title} ya existe. Revisa el slug y el título por favor`)
			}
			dto.slug = dto.slug
		}


		const newBook = new this.bookModel(dto)
		newBook.registeredBy = user._id

		await newBook.save()


		return {
			status: 'OK',
			statusCode: 201,
			message: 'Libro creado correctamente',
			newBook
		}
	}
}
