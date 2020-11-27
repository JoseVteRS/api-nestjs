import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/api/user/user.service';
import { UserRegistrationDto } from '../api/user/dtos/';
import { nanoid } from 'nanoid';
import { User } from 'src/api/user/interfaces/user.interface';
import { TokenPayload } from './interfaces/tokenPayload.interface';



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
		return {
			user,
			accessToken: this.jwtService.sign(payload)
		}
	}

	public getCookieWithJwtToken(sub: string) {
		const payload: TokenPayload = { sub };
		const token = this.jwtService.sign(payload);
		return `Authentication=${token}; HttpOnly; Path=/; Max-Age=3600`;
	}

	async signUp(dto: UserRegistrationDto) {
		const userExistByEmail = await this.userModel.findOne({ email: dto.email })
		if (userExistByEmail) throw new BadRequestException('Usuario ya existe con ese email')

		const alias = `@${dto.alias}`
		const userExistByalias = await this.userModel.findOne({ alias })
		if (userExistByalias) throw new BadRequestException(`El alias '@${dto.alias}' ya existe. Intenta con otro`)

		const dtoAlias = dto.alias = `@${dto.alias}`;
		const dtoPassword = dto.password = await bcrypt.hash(dto.password, 10);
		const dtoNanoid = dto.uid = nanoid();

		return await new this.userModel({ ...dto, dtoAlias, dtoPassword, dtoNanoid }).save()
	}

	async validateUser(email: string, pass: string): Promise<User> {
		const user = await this.userModel.findOne({ email });
		if (!user) {
			return null;
		}

		const valid = await bcrypt.compare(pass, user.password);

		if (valid) {
			return user;
		}

		return null;
	}





}