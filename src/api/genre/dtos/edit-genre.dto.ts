import { IsString, IsOptional, IsNotEmpty, IsMongoId, IsDateString } from 'class-validator';

export class EditGenreDto {

  @IsString()
  @IsNotEmpty({ message: 'El nombre del género es necesario' })
  genreName: string

  @IsString()
  @IsOptional()
  slug: string

  @IsString()
  @IsOptional()
  uriPhoto: string
}
