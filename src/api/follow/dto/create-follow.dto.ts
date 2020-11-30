import { IsMongoId, IsString, IsOptional } from 'class-validator';

export class CreateFollowDto {
  @IsString()
  @IsOptional()
  userId: string

  @IsString()
  @IsMongoId()
  followed: string
}
