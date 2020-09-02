import { Controller, Post, Body } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UserRequest } from '../../common/decorators/user.decorator';
import { AppResource } from 'src/app.roles';
import { Auth } from '../../common/decorators'
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { User } from '../user/interfaces/user.interface';

@ApiTags('Books')
@Controller('book')
export class BookController {
	constructor(
		private readonly bookService: BookService,
		// @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder
	) { }


	@Auth()
	@Post()
	async createOne(
		@UserRequest() user: User,
		@Body() dto: CreateBookDto
	) {

		return {
			message: 'LIBRO CREADO'
		}
		// let data
		// if (this.roleBuilder.can(user.roles).createAny(AppResource.BOOK).granted) {
		// 	data = await this.bookService.createOne(user, dto)
		// } else {
		// 	return {
		// 		message: 'No autorizado'
		// 	}
		// }

		// return {
		// 	message: 'Libro creado',
		// 	data
		// }
	}
}
