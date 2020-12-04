import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Author } from './interfaces/author.interface'
import { CreateAuthorDto, EditAuthorDto } from './dtos';
import { slugifyData } from '../../utils/slugifyData';

import { ErrorMessages } from '../common/messages.enum'


@Injectable()
export class AuthorService {
	constructor(
		@InjectModel('Author') private readonly authorModel: Model<Author>
	) { }

	public async createOne(user: any, dto: CreateAuthorDto) {
		const { _id } = user

		if (dto.slug !== undefined) {
			const slugFromDto = slugifyData(dto.slug)
			const checkAuthor = await this.authorModel.findOne({ slug: slugFromDto })
			if (checkAuthor) throw new BadRequestException(`El autor "${dto.authorName}" ya existe. Revísalo`)
			dto.slug = slugFromDto
		}

		if (dto.slug === undefined) {
			const slugNameFromDto = slugifyData(dto.authorName)
			const checkAuthor = await this.authorModel.findOne({ slug: slugNameFromDto })
			if (checkAuthor) throw new BadRequestException(`El autor '${dto.authorName}' ya existe. Revísalo`)
			dto.slug = slugNameFromDto
		}

		const newAuthor = new this.authorModel(dto)
		await newAuthor.save()

		newAuthor.registeredBy = _id;

		return {
			status: 'OK',
			statusCode: 201,
			message: 'Autor creado correctamente',
			newAuthor
		}
	}


	public async getMany(page = 1, limit = 10) {
		const total = await this.authorModel.countDocuments().exec();
		const totalPages = Math.ceil(total / limit);

		const results = await this.authorModel
			.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.populate('registeredBy', '_id username alias email')
		if (!results) throw new NotFoundException('No se han encontrado autores')
		return {
			status: 'OK',
			statusCode: 200,
			message: 'Todos los autores',
			results,
			limit,
			page,
			totalPages,
			totalDocs: total
		}
	}

	public async getOneById(id: string) {
		const author = await this.authorModel.findById(id)
		if (!author) throw new NotFoundException('No se ha encontrado autor con ese id')
		return {
			status: 'OK',
			statusCode: 200,
			message: `Se ha obtenido el autor ${author.authorName} correctamete`,
			author
		}
	}

	public async getOneBySlug(slug: string) {
		const author = await this.authorModel.findOne({ slug: slug })
		if (!author) throw new NotFoundException('No se ha podido encontrar el autor')

		return {
			status: 'OK',
			statusCode: 200,
			message: `Se ha obtenido el autor ${author.authorName} correctamete`,
			author
		}
	}

	public async editOneById(id: string, dto: EditAuthorDto) {

		const editedAuthor = await this.authorModel.findByIdAndUpdate(id, dto, { new: true });
		if (!editedAuthor) throw new NotFoundException('No se ha podido obtener los datos del autor seleccionado')
		if (!dto.authorName) throw new BadRequestException(`El NOMBRE AUTOR es obligatorio`)
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

