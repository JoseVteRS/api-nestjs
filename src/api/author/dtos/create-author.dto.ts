// import { User } from './../../user/interfaces/user.interface';
import { IsString, IsOptional, IsNotEmpty, IsMongoId, IsDateString } from 'class-validator';

export class CreateAuthorDto {

	@IsString()
	@IsNotEmpty({ message: 'El nombre del autor es necesario' })
	authorName: string;

	@IsString()
	@IsOptional()
	slug: string;

	@IsString()
	@IsOptional()
	authorBio: string;

	@IsString()
	@IsOptional()
	uriPhoto: string;

	@IsString()
	@IsDateString()
	@IsOptional()
	birthday: Date;

	@IsString()
	@IsOptional()
	@IsMongoId()
	registeredBy: string;

	@IsString()
	@IsDateString()
	@IsOptional()
	createdAt: Date;

	@IsString()
	@IsDateString()
	@IsOptional()
	updatedAt: Date;
};