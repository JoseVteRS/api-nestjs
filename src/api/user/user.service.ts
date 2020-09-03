import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';

import { User } from './schemas/user.schema';
import { CreateUserDto, EditUserDto } from './dtos';
import { AppRoles } from '../../app.roles';
import * as bcrypt from 'bcryptjs';


// (!userSchema ? u._id : !!u._id && userSchema._id === u._id ? u._id : null)

@Injectable()
export class UserService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>
	) { }


	async getMany() {
		return await this.userModel.find();
	}



	async getOne(id: string, userSchema?: User) {
		const user = await this.userModel.findOne({ _id: id })
		.then(u => (!userSchema ? u : !!u && userSchema._id === u._id ? u : null))
		// .then( (u) => {
		// 	console.log('u: -->', u);
		// 	console.log('userSchema: -->', userSchema);
		// 	return !userSchema ? u._id : !!u._id && userSchema._id === u._id ? u._id : null;
		// });



		if (!user) {
			throw new NotFoundException('User does not exists or unauthorized');
		}
		console.log('user.service.ts', user);
		return user;
	}


	async createOne(dto: CreateUserDto) {
		const userExistByEmail = await this.userModel.findOne({ email: dto.email })
		if (userExistByEmail) throw new BadRequestException('Usuario ya existe con ese email')

		const alias = `@${dto.alias}`
		const userExistByalias = await this.userModel.findOne({ alias })

		if (userExistByalias) throw new BadRequestException(`El alias '@${dto.alias}' ya existe. Intenta con otro`)

		const dtoAlias = dto.alias = `@${dto.alias}`;
		const dtoPassword = dto.password = await bcrypt.hash(dto.password, 10);
		const dtoNanoid = dto.uid = nanoid();
		const dtoRoles = dto.roles = [AppRoles.BASIC_USER]

		return await new this.userModel({ ...dto, dtoAlias, dtoPassword, dtoNanoid, dtoRoles }).save()
	}

	async editOne(id: string, dto: EditUserDto, userEntity?: User) {
		const user = await this.getOne(id, userEntity);
		const editedUser = Object.assign(user._id, dto);
		return await this.userModel.findByIdAndUpdate(editedUser, { new: true });
	}



	async deleteOne(id: string, userEntity?: User) {
		const user = await this.getOne(id, userEntity);
		return await this.userModel.findByIdAndDelete(user._id);
	}



	// FUNCIONES ------------------
	sanitizeUser(user: User) {
		const sanitized = user.toObject()
		delete sanitized['password'];
		delete sanitized['secretKeyConfirmation'];
		return sanitized;
	}

}
