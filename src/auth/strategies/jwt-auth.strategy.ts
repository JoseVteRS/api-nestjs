import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/api/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from '../../config/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly userService: UserService,
		private readonly config: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiraton: false,
			secretOrKey: config.get<string>(JWT_SECRET)
		})
	}

	async validate(payload: any) {
		const {sub: _id} = payload;

		return await this.userService.getOne(_id);
	}
}