import { IsString, IsOptional, IsNotEmpty, IsMongoId, IsDateString } from 'class-validator';

export class CreateGenreDto {

	@IsString()
	@IsNotEmpty({ message: 'El nombre del génro es necesario' })
	genreName: string

	@IsString()
	@IsOptional()
	slug: string

	@IsString()
	@IsOptional()
	uriPhoto: string

	@IsString()
	@IsOptional()
	@IsMongoId()
	registeredBy: string

	@IsString()
	@IsDateString()
	@IsOptional()
	createdAt: Date

	@IsString()
	@IsDateString()
	@IsOptional()
	updatedAt: Date;

}
