
import { Controller, Post, Body, Get, Param, Put, Delete, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { CreateAuthorDto, EditAuthorDto } from './dtos';

import { UserRequest } from '../../common/decorators/user.decorator';
import { Auth } from '../../common/decorators/auth.decorator';
import { AppResource } from '../../app.roles';
import { RolesBuilder, InjectRolesBuilder } from 'nest-access-control';


@ApiTags('Authors')
@Controller('author')
export class AuthorController {
	constructor(
		private readonly authorService: AuthorService,
		@InjectRolesBuilder()
		private readonly rolesBuilder: RolesBuilder
	) { }

	@Auth({
		possession: 'any',
		action: 'create',
		resource: AppResource.AUTHOR,
	})
	@Post()
	async createOne(
		@UserRequest() user: any,
		@Body() dto: CreateAuthorDto
	) {
		const rule = this.rolesBuilder.can(user.roles).createAny(AppResource.AUTHOR).granted;
		if(!rule) throw new UnauthorizedException();
		return await this.authorService.createOne(user, dto);
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


	@Auth({
		possession: 'any',
		action: 'update',
		resource: AppResource.AUTHOR,
	})
	@Put(':id')
	async editOne(
		@Param('id') id: string,
		@Body() dto: EditAuthorDto
	) {
		const editedAuthor = this.authorService.editOneById(id, dto)
		return editedAuthor
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
		const deleteAuthor = this.authorService.deleteOneById(id)
		return deleteAuthor
	}


}