import { Controller, Post, UseGuards, Body, Get, Param, Put } from '@nestjs/common';

import { UserRequest } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GenreService } from './genre.service';
import { CreateGenreDto, EditGenreDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Genres')
@Controller('genre')
export class GenreController {

	constructor(
		private readonly genreService: GenreService
	) { }

	@UseGuards(JwtAuthGuard)
	@Post()
	async createOne(
		@UserRequest() user: any,
		@Body() dto: CreateGenreDto
	) {
		const newGenre = await this.genreService.createOne(user, dto)
		return newGenre
	}

	@Get()
	async getMany() {
		const genres = await this.genreService.getMany()
		return genres
	}

	@Get(':id')
	async getOneById(
		@Param('id') id: string
	) {
		const genre = this.genreService.getOneById(id)
		return genre
	}

	@Get('slug/:slug')
	async getOneBySlug(
		@Param('slug') slug: string
	) {
		const genre = this.genreService.getOneBySlug(slug)
		return genre
	}

	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async editOne(
		@Param('id') id: string,
		@Body() dto: EditGenreDto
	) {
		const editedGenre = this.genreService.editOneById(id, dto)
		return editedGenre
	}

	@UseGuards(JwtAuthGuard)
	@Put(':id')
	async deleteOne(
		@Param('id') id: string,
	) {
		const deletedGenre = this.genreService.deletedOne(id)
		return deletedGenre
	}



}
