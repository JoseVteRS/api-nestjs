import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { UserService } from 'src/api/user/user.service';
import { User } from './../api/user/schemas/user.schema';



@Injectable()
export class AuthService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		private readonly userService: UserService,
		private jwtService: JwtService
	) { }



	async signIn(user: User) {
		const payload = { sub: user._id }
		user.password = undefined
		console.log(user)
		return {
			user,
			accessToken: this.jwtService.sign(payload)
		}
	}



	// async validateUser(email: string, pass: string): Promise<any> {
	// 	const user = await this.userService.getOneByEmail(email);
	// 	console.log(user)
	// 	if (!user) throw new UnauthorizedException('Datos incorrectos')
	// 	const valid = await bcrypt.compare(pass, user.password)
	// 	if (valid) {
	// 		return user
	// 	}
	// 	return null
	// }

	async validateUser(email: string, pass: string): Promise<User> {
		const user = await this.userModel.findOne({ email });
		console.log(user)
		if (!user) {
			return null;
		}

		const valid = await bcrypt.compare(pass, user.password);
		console.log('Válido: ', valid)

		if (valid) {
			return user;
		}

		return null;
	}


}