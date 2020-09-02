import { CreateGenreDto } from './create-genre.dto';
import { PartialType } from '@nestjs/mapped-types';

export class EditGenreDto extends PartialType(CreateGenreDto) {}
