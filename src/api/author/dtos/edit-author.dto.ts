import { CreateAuthorDto } from './create-author.dto';
import { PartialType } from '@nestjs/mapped-types'

export class EditAuthorDto extends PartialType(CreateAuthorDto) { }
