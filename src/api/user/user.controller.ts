
import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto, EditUserDto } from './dtos';
import { UserService } from './user.service';

import { AppResource } from '../../app.roles';
import { Auth, UserRequest } from 'src/common/decorators';
import { RolesBuilder, InjectRolesBuilder } from 'nest-access-control';
import { User } from './schemas/user.schema';



@ApiTags('Users')
@Controller('user')
export class UserController {

	constructor(
		private readonly userService: UserService,
		@InjectRolesBuilder()
		private readonly rolesBuilder: RolesBuilder
	) { }



	@Auth({ possession: 'any', action: 'create', resource: AppResource.USER })
	@Post()
	async createOne(
		@Body() dto: CreateUserDto
	) {
		const newUser = await this.userService.createOne(dto)
		return {
			message: 'Usuario registrado correctamente',
			newUser
		}
	}



	@Post('signup')
	async signUp(
		@Body() dto: CreateUserDto
	) {
		const data = await this.userService.createOne(dto);
		return { data }
	}



	@Get()
	async getMany() {
		const data = await this.userService.getManyAsPublic()
		return {
			data
		}
	}


	@Get(':id')
	async getOneById(
		@Param('id') id: string
	) {
		const data = await this.userService.getOneById(id);
		return {
			data
		}
	}



	@Get('all')
	async getAll() {
		const data = await this.userService.getMany()
		return {
			data
		}
	}


	@Auth({
		possession: 'own',
		action: 'update',
		resource: AppResource.USER,
	})
	@Put(':id')
	async editOne(
		@Param('id') id: string,
		@Body() dto: EditUserDto,
		@UserRequest() user: User
	) {
		console.group( '\n\n ----------------------- user.controller.ts ----------------------- ')
		console.group('\n\n ------------ USER REQUEST (LOGUEADO) ------------ \n')
		console.log(`Usuario desde @UserController ${user}`)
		console.groupEnd()

		let data: any;
		const rule = this.rolesBuilder.can(user.roles).updateAny(AppResource.USER).granted;

		if (rule) {
			// esto es admin
			data = await this.userService.editOne(id, dto);
			console.group('\n\n ------------ ROLE ------------ \n')
			console.log('Esto es un admin');
			console.log(`Role desde @UserController: --> ${rule}`)
			console.groupEnd()
			console.group('\n\n ------------ DATA = TRUE (ADMIN) ------------ \n')
			console.log('Data rule = true: ', data);
			console.groupEnd()
		} else {
			// esto es un user normal
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { roles, ...rest } = dto;
			data = await this.userService.editOne(id, rest, user);
			console.group('\n\n ------------ ROLE ------------ \n')
			console.log('Esto es un USUARIO NORMAL');
			console.log(`Role desde @UserController: --> ${rule}`)
			console.groupEnd()
			console.group('\n\n ------------ DATA = FALSE (USER) ------------ \n')
			console.log('Data rule = false: ', data);
			console.groupEnd()
		}
		console.groupEnd()
		return { status: 'OK', statusCode: 200, message: 'Usuario editado', data };
	}



	@Auth({
		possession: 'own',
		action: 'delete',
		resource: AppResource.USER
	})
	@Delete(':id')
	async deleteOne(
		@Param('id') id: string,
		@UserRequest() user: User
	) {
		let data: any;
		if (this.rolesBuilder
			.can(user.roles)
			.deleteAny(AppResource.USER)
			.granted
		) {
			// esto es admin
			data = await this.userService.deleteOne(id);
		} else {
			// esto es un user normal
			data = await this.userService.deleteOne(id, user);
		}
		return { status: 'OK', statusCode: 200, message: 'Usuario eliminado', data };
	}

}
