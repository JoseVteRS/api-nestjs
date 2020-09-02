import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthCredentialsDto } from './dto/auth-credentials.dto';

import { User } from '../api/user/interfaces/user.interface';
import { UserRequest } from '../common/decorators/user.decorator';
import { LoginDto } from './dtos/login.dto';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authServices: AuthService) { }

	// @Post('/signup')
	// async signUp(
	// 	@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
	// ): Promise<void> {
	// 	return await this.authServices.signUp(authCredentialsDto)
	// }

	@UseGuards(LocalAuthGuard)
	@Post('signin')
	async signIn(
		@Body() loginDto: LoginDto,
		@UserRequest() user: User
	) {
		const data = await this.authServices.signIn(user)
		const { accessToken } = data
		user.password = undefined
		user.email = undefined
		console.log(data)
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
		return user
	}






}

