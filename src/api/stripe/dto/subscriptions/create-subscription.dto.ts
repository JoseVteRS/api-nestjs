import { IsString, IsOptional, IsNotEmpty, IsMongoId, IsBoolean } from 'class-validator';


export class CreateLikeDto {

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
