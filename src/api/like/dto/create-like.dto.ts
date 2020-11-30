import { IsString, IsOptional, IsNotEmpty, IsMongoId, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { TypeLike } from '../enums/type-like.enum';

export class CreateLikeDto {

  @IsEnum(TypeLike)
  @IsNotEmpty({ message: 'Es obligatorio' })
  entityType: string

  @IsString()
  @IsNotEmpty({ message: 'Es obligatorio' })
  @IsMongoId()
  entityId: string

  @IsString()
  @IsOptional()
  @IsMongoId()
  userId: string;

  @IsBoolean()
  @IsOptional()
  like: boolean;
}
