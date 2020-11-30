import { Controller, Post, UseGuards, Get, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';


import { User } from '../api/user/interfaces/user.interface';
import { UserRequest } from '../common/decorators/user.decorator';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { ApiTags } from '@nestjs/swagger';
import { UserRegistrationDto } from '../api/user/dtos/user-signup.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authServices: AuthService) { }

	@Post('signup')
	async signUp(
		@Body() dto: UserRegistrationDto
	) {
		return await this.authServices.signUp(dto)
	}

	@UseGuards(LocalAuthGuard)
	@Post('signin')
	async signIn(
		@UserRequest() user: User,
		@Request() req: any
	) {

		const data = await this.authServices.signIn(user);
		const { accessToken } = data
		req.session.token = accessToken
		console.log(req.session);
		user.password = undefined
		user.email = undefined

		return {
			status: 'OK',
			statusCode: 200,
			message: 'Inicio de sesión con éxito',
			user,
			accessToken
		}
	}


	@UseGuards(JwtAuthGuard)
	@Get('refresh')
	async refreshToken(@UserRequest() user: User) {
		const data = await this.authServices.signIn(user)

		return {
			status: 'OK',
			statusCode: 200,
			message: 'Refresh token con éxito',
			data
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getMe(
		@UserRequest() user: User
	) {
		return user;
	}






}

