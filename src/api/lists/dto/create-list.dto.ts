import { IsString, IsOptional, IsNotEmpty, IsArray, IsBoolean } from 'class-validator';


export class CreateListDto {

  @IsString()
  @IsNotEmpty({ message: 'Título de la lista es obligatorio' })
  title: string

  @IsString()
  @IsOptional()
  slug: string

  @IsString()
  @IsOptional()
  description: string

  @IsArray()
  @IsNotEmpty({ message: 'Debe insertar al menos un libro en su lista' })
  books: string[]

  @IsBoolean()
  @IsOptional()
  isPublic: boolean
}
