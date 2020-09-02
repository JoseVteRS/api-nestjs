import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schemas/user.schema';
import { CreateUserDto, EditUserDto } from './dtos';




@Injectable()
export class UserService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>
	) { }


	async getMany() {
		return await this.userModel.find();
	}



	async getOne(id: string, userSchema?: User) {
		const user = await this.userModel.findOne({ _id: id }).exec()
			.then(u => (!userSchema ? u : !!u && userSchema._id === u._id ? u : null));
		if (!user) {
			throw new NotFoundException('User does not exists or unauthorized');
		}
		return user;
	}


	async createOne(dto: CreateUserDto) {
		const userExist = await this.userModel.findOne({ email: dto.email });
		if (userExist) throw new BadRequestException('User already registered with email');

		const newUser = new this.userModel(dto);
		const user = await newUser.save();

		delete user.password;
		return user;
	}

	async editOne(id: string, dto: EditUserDto, userEntity?: User) {
		console.log(dto);
		const user = await this.getOne(id, userEntity);
		const editedUser = Object.assign(user._id, dto);
		return await this.userModel.findByIdAndUpdate(editedUser, { new: true });
	}



	async deleteOne(id: string, userEntity?: User) {
		const user = await this.getOne(id, userEntity);
		return await this.userModel.findByIdAndDelete(user._id);
	}



	sanitizeUser(user: User) {
		const sanitized = user.toObject()
		delete sanitized['password'];
		delete sanitized['secretKeyConfirmation'];
		return sanitized;
	}

}
