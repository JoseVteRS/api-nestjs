import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schemas/user.schema';
import { CreateUserDto, EditUserDto } from './dtos';
import * as bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { AppRoles } from '../../app.roles';


@Injectable()
export class UserService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>
	) { }



	async getMany() {
		const users = await this.userModel.find()
		if (!users) throw new NotFoundException('No ha sido posible mostrar los usuarios')
		return {
			status: 'OK',
			statusCode: 200,
			message: 'Todos los usuarios',
			users: users,
			total: users.length
		}
	}



	async getOne(uid: string, userSchema?: User) {
		const user = await this.userModel
			.findOne({uid}).exec()
			.then(usr => (!userSchema ? usr : !!usr && userSchema.uid === usr.uid ? usr : null) );

		console.group('\n\n ------------------ user.service.ts ------------------ \n')

		console.group('\n ----- const user = findById (mongoose) ----- \n')
		console.log('User @UserService', user);
		console.groupEnd()

		console.group('\n\n ----- userSchema?: User (2n parámetro getOne() ) ----- \n')
		console.log('User @UserService userSchema', user);
		console.groupEnd()

		console.groupEnd()

		if (!user) {
			throw new NotFoundException('User does not exists or unauthorized');
		}
		return user;
	}



	async getManyAsPublic() {
		const users = await this.userModel.find()
		if (!users) throw new NotFoundException('No ha sido posible mostrar los usuarios')
		const filterIsPublic = users.filter(user => user.isPublic === true)
		const sanitized = filterIsPublic.map(user => {
			user.password = undefined
			user.email = undefined
			return user
		})
		return {
			status: 'OK',
			statusCode: 200,
			message: 'Todos los usuarios con perfiles públicos',
			users: sanitized,
			total: sanitized.length
		}
	}



	async createOne(dto: CreateUserDto) {
		const userExistByEmail = await this.userModel.findOne({ email: dto.email })
		if (userExistByEmail) throw new BadRequestException('Usuario ya existe con ese email')
		const alias = `@${dto.alias}`
		const userExistByalias = await this.userModel.findOne({ alias: alias })
		if (userExistByalias) throw new BadRequestException(`El alias '@${dto.alias}' ya existe. Intenta con otro`)
		const dtoAlias = dto.alias = `@${dto.alias}`;
		const dtoPassword = dto.password = await bcrypt.hash(dto.password, 10);
		const dtoNanoid = dto.uid = nanoid();
		const dtoRoles = dto.roles = [AppRoles.BASIC_USER]
		return await new this.userModel({ ...dto, dtoAlias, dtoPassword, dtoNanoid, dtoRoles }).save()
	}



	async editOne(id: string, dto: EditUserDto, userSchema?: User) {
		await this.getOne(id, userSchema)
		const alias = `@${dto.alias}`;
		const userExistByAlias = await this.userModel.findOne({ alias: alias });
		if (userExistByAlias) throw new BadRequestException(`El alias '@${dto.alias}' ya existe. Intenta con otro`);
		dto.updatedAt = new Date();
		if (dto.alias) dto.alias = alias;
		// const test = Object.assign(user, dto);
		const editedUser = await this.userModel.findByIdAndUpdate(id, dto, { new: true });
		return this.sanitizeUser(editedUser);
	}



	async deleteOne(id: string, userSchema?: User) {
		const user = await this.getOne(id, userSchema);
		console.log('deleteOne', userSchema);
		// if (!user) throw new NotFoundException('No se ha podido borrar el usuario');
		const deletedUser = await this.userModel.findByIdAndDelete(user);
		return {
			message: 'Usuario borrado correctamente',
			deletedUser: this.sanitizeUser(deletedUser)
		}
	}



	// auth.service.ts
	async getOneByEmail(email: string) {
		const user = await this.userModel.findOne({ email });
		if (!user) throw new NotFoundException('No existe el usuario');
		return user;
	}

	async getOneById(id: string) {
		const user = await this.userModel.findById({ _id: id })
		return user
	}



	sanitizeUser(user: User) {
		const sanitized = user.toObject()
		delete sanitized['password'];
		delete sanitized['secretKeyConfirmation'];
		return sanitized;
	}

}
