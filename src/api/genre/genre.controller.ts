import { Controller, Post, UseGuards, Body, Get, Param, Put } from '@nestjs/common';

import { UserRequest } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GenreService } from './genre.service';
import { CreateGenreDto, EditGenreDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';
import { AppResource } from '../../app.roles';
import { RolesBuilder, InjectRolesBuilder } from 'nest-access-control';

@ApiTags('Genres')
@Controller('genre')
export class GenreController {

	constructor(
		private readonly genreService: GenreService,
		@InjectRolesBuilder()
		private readonly rolesBuilder: RolesBuilder
	) { }

	@Auth({
		possession: 'any',
		action: 'create',
		resource: AppResource.GENRE,
	})
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

	@Auth({
		possession: 'any',
		action: 'update',
		resource: AppResource.GENRE,
	})
	@Put(':id')
	async editOne(
		@Param('id') id: string,
		@Body() dto: EditGenreDto
	) {
		const editedGenre = this.genreService.editOneById(id, dto)
		return editedGenre
	}

	@Auth({
		possession: 'any',
		action: 'delete',
		resource: AppResource.GENRE,
	})
	@Put(':id')
	async deleteOne(
		@Param('id') id: string,
	) {
		const deletedGenre = this.genreService.deletedOne(id)
		return deletedGenre
	}



}
