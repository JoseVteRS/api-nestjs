import { User } from './interfaces/user.interface';

import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto, EditUserDto } from './dtos';
import { UserService } from './user.service';

import { AppResource } from '../../app.roles';
import { Auth, UserRequest } from 'src/common/decorators';
import { RolesBuilder, InjectRolesBuilder } from 'nest-access-control';


@ApiTags('Users')
@Controller('user')
export class UserController {

	constructor(
		private readonly userService: UserService,
		@InjectRolesBuilder()
		private readonly rolesBuilder: RolesBuilder
	) { }


	@Get()
	async getMany() {
		const data = await this.userService.getMany();

		return { staus: 'OK', statusCode: 200, data };
	}

	@Get(':id')
	async getOne(@Param('id') id: string) {
		const data = await this.userService.getOne(id);
		return { staus: 'OK', statusCode: 200, data };
	}



	@Auth({
		possession: 'any',
		action: 'create',
		resource: AppResource.USER,
	})
	@Post()
	async createOne(@Body() dto: CreateUserDto) {
		const data = await this.userService.createOne(dto);
		return { status: 'OK', statusCode: 201, message: 'User created', data };
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
		@UserRequest() user: User,
	) {
		let data: any;
		const rule = this.rolesBuilder.can(user.roles).updateAny(AppResource.USER).granted;
		if (rule) {
			// esto es un admin
			data = await this.userService.editOne(id, dto);
		} else {
			// esto es un owner
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { roles, ...rest } = dto;
			data = await this.userService.editOne(id, rest, user);
		}
		return { status: 'OK', statusCode: 200, message: 'User edited', data };
	}



	@Auth({
		action: 'delete',
		possession: 'own',
		resource: AppResource.USER,
	})
	@Delete(':id')
	async deleteOne(@Param('id') id: string, @UserRequest() user: User) {
		let data: any;

		if (this.rolesBuilder.can(user.roles).updateAny(AppResource.USER).granted) {
			// esto es un admin
			data = await this.userService.deleteOne(id);
		} else {
			// esto es un author
			data = await this.userService.deleteOne(id, user);
		}
		return { status: 'OK', statusCode: 200, message: 'User deleted', data };
	}

}
