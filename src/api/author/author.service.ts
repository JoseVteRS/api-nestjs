import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Author } from './interfaces/author.interface'
import { CreateAuthorDto, EditAuthorDto } from './dtos';
import { slugifyData } from '../../utils/slugifyData';


@Injectable()
export class AuthorService {
	constructor(
		@InjectModel('Author') private readonly authorModel: Model<Author>
	) { }

	public async createOne(user: any, dto: CreateAuthorDto) {
		const { _id } = user

		if (dto.slug !== undefined) {
			const slugFromDto = slugifyData(dto.slug)
			console.log('From DTO', slugFromDto)
			const checkAuthor = await this.authorModel.findOne({ slug: slugFromDto })
			if (checkAuthor) throw new BadRequestException(`El autor ${dto.authorName} ya existe. Revísalo`)
			dto.slug = slugFromDto
		}

		if (dto.slug === undefined) {
			const slugNameFromDto = slugifyData(dto.authorName)
			console.log('From Name', slugNameFromDto)
			const checkAuthor = await this.authorModel.findOne({ slug: slugNameFromDto })
			if (checkAuthor) throw new BadRequestException(`El autor ${dto.authorName} ya existe. Revísalo`)
			dto.slug = slugNameFromDto
		}

		const newAuthor = new this.authorModel(dto)
		await newAuthor.save()

		newAuthor.registeredBy = _id

		return {
			status: 'OK',
			statusCode: 201,
			message: 'Autor creado correctamente',
			newAuthor
		}
	}


	public async getMany() {
		const authors = await this.authorModel.find()
		if(!authors) throw new NotFoundException('No se ha podido mostrar los autores')
		return {
			status: 'OK',
			statusCode: 200,
			message: 'Todos los autores',
			authors
		}
	}

	public async getOneById(id: string) {
		const author = await this.authorModel.findById({ id })
		return {
			status: 'OK',
			statusCode: 200,
			message: `Se ha obtenido el autor ${author.authorName} correctamete`,
			author
		}
	}

	public async getOneBySlug(slug: string){
		const author = await this.authorModel.findOne({slug: slug})
		if(!author) throw new NotFoundException('No se ha podido mostrar el autor')

		return {
			status: 'OK',
			statusCode: 200,
			message: `Se ha obtenido el autor ${author.authorName} correctamete`,
			author
		}
	}

	public async editOneById(id: string, dto: EditAuthorDto) {
		const checkAuthor = await this.authorModel.findOne({ id })
		if (!checkAuthor) throw new NotFoundException('No se ha podido obtener los datos del autor seleccionado')

		const editedAuthor = await this.authorModel.findByIdAndUpdate(id,  {dto}, { new: true })

		editedAuthor.updatedAt = new Date()

		return {
			status: 'OK',
			statusCode: 200,
			message: `Autor ${editedAuthor.authorName} editado correctamete`,
			editedAuthor
		}
	}

	public async deleteOneById(id: string) {
		const checkAuthor = await this.authorModel.findById({ _id: id })
		if (!checkAuthor) throw new NotFoundException('No se ha podido obtener los datos del autor seleccionado')

		const deletedAuthor = await this.authorModel.findByIdAndDelete(id)

		return {
			status: 'OK',
			statusCode: 200,
			message: `Autor eliminado correctamete`,
			deletedAuthor
		}
	}

}

