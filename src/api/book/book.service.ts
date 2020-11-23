import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './interfaces/book.interface';
import { CreateBookDto } from './dtos/create-book.dto';
import { slugifyData } from '../../utils/slugifyData';
import { AuthorService } from '../author/author.service';
import { GenreService } from '../genre/genre.service';
import { EditBookDto } from './dtos/edit-book.dto';

// https://stackoverflow.com/questions/51819504/inject-nestjs-service-from-another-module
@Injectable()
export class BookService {
	constructor(
		@InjectModel('Book') private readonly bookModel: Model<Book>,
		private readonly authorService: AuthorService,
		private readonly genreService: GenreService
	) { }

	public async createOne(user: any, dto: CreateBookDto) {

		const book = await this.bookModel.findOne({ title: dto.title })
		if (book) throw new BadRequestException('Libro ya existe');

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

	public async getOneById(id: string) {
		const book = await this.bookModel.findById(id)
			.populate('author', '_id authorName slug')
			.populate('genre', '_id genreName slug')
		return {
			status: 'OK',
			statusCode: 200,
			message: `Se ha obtenido el autor ${book.title} correctamete`,
			book
		}
	}

	public async getOneBySlug(slug: string) {
		const book = await this.bookModel.findOne({ slug })
			.populate('author', '_id authorName slug')
			.populate('genre', '_id genreName slug')
		if (!book) throw new NotFoundException('No se ha podido encontrar el libro')
		return {
			status: 'OK',
			statusCode: 200,
			message: `Se ha obtenido el autor ${book.title} correctamete`,
			book
		}
	}

	public async getAll(
		page = 1,
		limit = 10
	) {
		// const results = await this.bookModel
		// 	.find()
		// 	.skip(limit * page)
		// 	.limit(limit)
		// 	.exec()
		// return {
		// 	results,
		// 	limit,
		// 	page,
		// 	total: await this.bookModel.countDocuments().exec()
		// }

		const books = await this.bookModel.find()
		return books

	}

	public async getBooksSameAuthor(id: string) {
		const books = await this.bookModel.find({
			author: { $eq: id }
		})
			.populate('author', '_id authorName slug')
			.populate('genre', '_id genreName slug')
		const author = await this.authorService.getOneById(id)
		return {
			status: 'OK',
			statusCode: 200,
			message: `Se han encontrado libros con el mismo autor`,
			result: {
				author,
				books
			}
		}
	}

	public async getBooksSameGenre(id: string) {
		const books = await this.bookModel.find({
			genre: { $eq: id }
		})
			.populate('author', '_id authorName slug')
			.populate('genre', '_id genreName slug')
		const genre = await this.genreService.getOneById(id)
		return {
			status: 'OK',
			statusCode: 200,
			message: `Se han encontrado libros con el mismo género`,
			result: {
				genre,
				books
			}
		}
	}

	public async updateOne(id: string, dto: EditBookDto) {
		const book = await this.bookModel.findByIdAndUpdate(
			id,
			dto,
			{ new: true },
		);
		if (!book) throw new NotFoundException('No se ha podido encontrar el libro con ese id')
		if (!dto.title) throw new BadRequestException('El campo título es obligatorio')
		if (!dto.author) throw new BadRequestException('El campo autor es obligatorio')
		if (!dto.genre) throw new BadRequestException('El campo género es obligatorio')
		return {
			status: 'OK',
			statusCode: 200,
			message: `El libro se ha actualizado correctamente`,
			result: book
		}

	}

	public async deleteOne(id: string) {
		const book = this.bookModel.findOneAndDelete({ _id: id })
		if (!book) throw new NotFoundException('No se ha podido encontrar el libro con ese id')
		return {
			status: 'OK',
			statusCode: 200,
			message: `El libro se ha eliminado correctamente`,
			result: book
		}
	}



}
