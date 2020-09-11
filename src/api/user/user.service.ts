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
		const users = await this.userModel.find();
		if (!users) {
			throw new NotFoundException('No se ha podido cargar los usuarios. Inténtalo más tarde')
		}
		return users;
	}


	async getOne(id: string, userEntity?: User) {
		const user = await this.userModel
		.findById(id)
		.then(u => (!userEntity ? u : !!u && userEntity.id === u.id ? u : null));

	  if (!user)
		throw new NotFoundException('User does not exists or unauthorized');

	  return user;
	}

	async checkOne(id: string, userShema?: User) {
		const user = await this.userModel.findById(id);

		if (userShema && userShema._id === user._id) {
			return user
		} else {
			return null
		}
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
		console.log(dto, '----------------------- \n\n\n\n\n\n');
		const user = await this.getOne(id, userEntity);
		// const editedUser = Object.assign(user._id, dto);
		return await this.userModel.findByIdAndUpdate(user._id, dto, { new: true });
	}



	async deleteOne(id: string, userEntity?: User) {
		const user = await this.getOne(id);
		return await this.userModel.findByIdAndDelete(user);
	}


	// FUNCIONES ------------------
	sanitizeUser(user: User) {
		const sanitized = user.toObject()
		delete sanitized['password'];
		delete sanitized['secretKeyConfirmation'];
		return sanitized;
	}

}
