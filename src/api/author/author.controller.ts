// import { User } from './../user/interfaces/user.interface';
import { Controller, Post, UseGuards, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { EditAuthorDto } from './dtos/edit-author.dto';
import { UserRequest } from '../../common/decorators/user.decorator';


@ApiTags('Authors')
@Controller('author')
export class AuthorController {
	constructor(
		private readonly authorService: AuthorService
	) { }

	@UseGuards(JwtAuthGuard)
	@Post()
	async createOne(
		@UserRequest() user: any, // User
		@Body() dto: CreateAuthorDto
	) {
		const author = await this.authorService.createOne(user, dto)
		return author
	}

	@Get()
	async getMany() {
		const authors = await this.authorService.getMany()
		return authors
	}

	@Get(':id')
	async getOneById(
		@Param('id') id: string
	) {
		const author = await this.authorService.getOneById(id)
		return author
	}

	@Get('slug/:slug')
	async getOneBySlug(
		@Param('slug') slug: string
	) {
		const author = await this.authorService.getOneBySlug(slug)
		return author
	}


	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async editOne(
		@Param('id') id: string,
		@Body() dto: EditAuthorDto
	) {
		const editedAuthor = this.authorService.editOneById(id, dto)
		return editedAuthor
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async deleteOne(
		@Param('id') id: string
	) {
		const deleteAuthor = this.authorService.deleteOneById(id)
		return deleteAuthor
	}


}