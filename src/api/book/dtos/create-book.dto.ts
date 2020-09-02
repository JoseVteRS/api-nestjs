import { IsString, IsDateString, IsOptional, IsMongoId, IsNotEmpty, IsArray } from 'class-validator';


export class CreateBookDto {

	@IsString()
	@IsOptional()
	slug: string

	@IsString()
	@IsNotEmpty({ message: 'El título del libro es obligatorio' })
	title: string

	@IsString()
	@IsOptional()
	sinopsis: string

	@IsArray()
	@IsNotEmpty({ message: 'El autor del libro es obligatorio' })
	author: string[]

	@IsArray()
	@IsNotEmpty({ message: 'El género del libro es obligatorio' })
	genre: string

	@IsString()
	@IsOptional()
	coverUrl: string

	@IsString()
	@IsOptional()
	isbn10: string

	@IsString()
	@IsOptional()
	isbn13: string

	@IsString()
	@IsMongoId()
	@IsOptional()
	registeredBy: string

	@IsString()
	@IsDateString()
	@IsOptional()
	createdAt: Date

	@IsString()
	@IsDateString()
	@IsOptional()
	updatedAt: Date


}
