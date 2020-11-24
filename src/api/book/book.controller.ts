import { Controller, Post, Body, Delete, Param, Get, NotFoundException, Query, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UserRequest } from '../../common/decorators/user.decorator';
import { Auth } from '../../common/decorators'
import { ApiTags } from '@nestjs/swagger';
import { AppResource } from 'src/app.roles';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { User } from '../user/interfaces/user.interface';
import { EditBookDto } from './dtos/edit-book.dto';

@ApiTags('Books')
@Controller('book')
export class BookController {
	constructor(
		private readonly bookService: BookService,
	) { }


	@Auth({
		possession: 'any',
		action: 'create',
		resource: AppResource.BOOK,
	})
	@Post()
	async createOne(
		@UserRequest() user: User,
		@Body() dto: CreateBookDto
	) {

		const result = await this.bookService.createOne(user, dto);
		return {
			status: 'OK',
			statusCode: 201,
			message: 'Libro creado correctamente',
			result
		}
	}

	@Get()
	async getAll(
		@Query('page') page?: string,
		@Query('limit') limit?: string,
	) {
		const p = parseInt(page);
		const l = parseInt(limit);
		const books = await this.bookService.getAll(
			p,
			l
		)
		return books
	}

	@Get('by-author/:id')
	async getBooksSameAuthor(
		@Param('id') id: string
	) {
		const books = await this.bookService.getBooksSameAuthor(id)
		return books
	}

	@Auth({
		possession: 'any',
		action: 'update',
		resource: AppResource.BOOK,
	})
	@Put(':id')
	async updateOne(
		@Param('id') id: string,
		@Body() dto: EditBookDto
	) {

		const result = await this.bookService.updateOne(id, dto);
		return {
			status: 'OK',
			statusCode: 201,
			message: 'Libro actualizado correctamente',
			result
		}
	}

	@Auth({
		possession: 'any',
		action: 'delete',
		resource: AppResource.AUTHOR,
	})
	@Delete(':id')
	async deleteOne(
		@Param('id') id: string
	) {
		const deleleBook = this.bookService.deleteOne(id)
		return deleleBook
	}


}


