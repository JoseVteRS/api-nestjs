
import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto, EditUserDto } from './dtos';
import { UserService } from './user.service';

import { AppResource, AppRoles } from '../../app.roles';
import { Auth, UserRequest } from 'src/common/decorators';
import { RolesBuilder, InjectRolesBuilder } from 'nest-access-control';
import { User } from './schemas/user.schema';
import { UserRegistrationDto } from './dtos/user-signup.dto';



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

		return { data };
	}


	@Post('register')
	async publicRegistration(@Body() dto: UserRegistrationDto) {
		const data = await this.userService.createOne({
			...dto,
			roles: [AppRoles.BASIC_USER]
		});
		return { message: 'User registered', data }
	}


	@Get(':id')
	async getOne(@Param('id') id: string) {
		const data = await this.userService.getOne(id);
		return { data };
	}



	@Auth({
		possession: 'any',
		action: 'create',
		resource: AppResource.USER,
	})
	@Post()
	async createOne(@Body() dto: CreateUserDto) {
		const data = await this.userService.createOne(dto);
		return { message: 'User created', data };
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
		const rule =  this.rolesBuilder.can(user.roles).updateAny(AppResource.USER).granted;
		console.log('\n --------- user.controler.ts - Usuario que viene del request --------- \n\n', user._id)
		console.log('\n--------- user.controler.ts - id que llega de los parmas --------- \n\n', id)
		if (rule) {
			// esto es un admin
			data = await this.userService.editOne(id, dto);
		} else {
			// esto es un author
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { roles, ...rest } = dto;
			data = await this.userService.editOne(id, rest, user);
		}
		return { message: 'User edited', data };
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
		return { message: 'User deleted', data };
	}

}
