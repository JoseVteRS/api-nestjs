import { Controller, Req, Post, UseGuards, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserRequest } from '@Src/common/decorators/user.decorator';
import { AuthService } from '@Auth/auth.service';
import { LocalAuthGuard, JwtAuthGuard } from '@Auth/guards';
import { User } from '@Users/interfaces/user.interface';
import { UserRegistrationDto } from '@Users/dtos/user-signup.dto';


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
		@Req() req: any,
	) {

		const data = await this.authServices.signIn(user);
		const { accessToken } = data
		req.session.token = accessToken
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

	@Get('google')
	@UseGuards(AuthGuard('google'))
	googleAuth(@Req() req) { }

	@Get('google/redirect')
	@UseGuards(AuthGuard('google'))
	googleAuthRedirect(@Req() req) {
		return this.authServices.googleLogin(req)
	}




}

