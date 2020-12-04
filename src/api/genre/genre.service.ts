
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Genre } from './interfaces/genre.interface';
import { CreateGenreDto, EditGenreDto } from './dtos';
import { slugifyData } from '../../utils/slugifyData';


@Injectable()
export class GenreService {
	constructor(
		@InjectModel('Genre') private readonly genreModel: Model<Genre>
	) { }


	public async createOne(user: any, dto: CreateGenreDto) {
		const { _id } = user
		if (dto.slug !== undefined) {
			const slugFromDto = slugifyData(dto.slug)
			const checkGenre = await this.genreModel.findOne({ slug: slugFromDto })
			if (checkGenre) throw new BadRequestException(`El género '${dto.genreName}' ya existe. Revísalo`)
			dto.slug = slugFromDto
		}

		if (dto.slug === undefined) {
			const slugNameFromDto = slugifyData(dto.genreName)
			const checkGenre = await this.genreModel.findOne({ slug: slugNameFromDto })
			if (checkGenre) throw new BadRequestException(`El género '${dto.genreName}' ya existe. Revísalo`)
			dto.slug = slugNameFromDto
		}

		const newGenre = new this.genreModel(dto)
		await newGenre.save()

		newGenre.registeredBy = _id

		return {
			status: 'OK',
			statusCode: 201,
			message: 'Género creado correctamente',
			newGenre
		}
	}

	public async getMany() {
		const genres = this.genreModel.find()
		if (!genres) throw new NotFoundException('No se ha podido obtener los géneros')
		return genres
	}

	public async getOneById(id: string) {
		const checkGenre = await this.genreModel.findById({ _id: id })
		if (!checkGenre) throw new NotFoundException('No se ha encontrado el género seleccionado')

		return {
			status: 'OK',
			statusCode: 200,
			message: 'Género by id',
			checkGenre
		}
	}

	public async getOneBySlug(slug: string) {
		const checkGenre = await this.genreModel.findOne({ slug: slug })
		if (!checkGenre) throw new NotFoundException('No se ha encontrado el género seleccionado')

		return {
			status: 'OK',
			statusCode: 200,
			message: 'Género by slug',
			checkGenre
		}
	}

	public async editOneById(id: string, dto: EditGenreDto) {
		const checkGenre = await this.genreModel.findOne({ _id: id })
		if (!checkGenre) throw new NotFoundException('No se ha podido obtener los datos del género seleccionado')

		const editedGenre = await this.genreModel.findByIdAndUpdate(id, dto, { new: true })

		return {
			status: 'OK',
			statusCode: 200,
			message: `Género ${editedGenre.genreName} editado correctamete`,
			editedGenre
		}
	}

	public async deletedOne(id: string) {
		const checkGenre = await this.genreModel.findOne({ _id: id })
		if (!checkGenre) throw new NotFoundException('No se ha podido obtener los datos del género seleccionado')

		const deletedGenre = await this.genreModel.findByIdAndDelete(id)
		return {
			status: 'OK',
			statusCode: 200,
			message: `Género borrado correctamete`,
			deletedGenre
		}
	}

}
