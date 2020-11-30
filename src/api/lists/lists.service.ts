import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { Model } from 'mongoose';

import { List } from './entities/list.entity';
import { slugifyData } from '../../utils/slugifyData';
import { AppRoles } from '../../app.roles';
import { User } from '../user/interfaces/user.interface';
import { isAdmin } from '../common/isAdmin';

@Injectable()
export class ListsService {

  constructor(
    @InjectModel('List') private readonly listModel: Model<List>
  ) { }

  /**
   *
   * @param dto
   * @param user
   *
   * Crear una lista.
   * owner se registra automáticamente cogiendo el Id del
   * Authorization: Bearer token
   */
  public async create(dto: CreateListDto, user: any) {
    const titleSlugified = slugifyData(dto.title)
    const listLength = await this.listModel.countDocuments({ owner: user._id }).exec()

    /**
     * Condición para comprobar si el usuario es `BASIC_USER` y ya ha creado 3 listas
     * entonces no se le permite crear más y se le propone pagar para tener listas indefinidas
     */
    if (user.roles[0] === AppRoles.BASIC_USER && listLength >= 3) {
      throw new BadRequestException('No puedes crear más de 3 listas con el plan básico')
    }

    /**
     * Condición para comprobar si el usuario es `BASIC_USER` solo podrá crear listas públicas
     */

    if (user.roles[0] === AppRoles.BASIC_USER && dto.isPublic === false) {
      throw new BadRequestException('No puedes crear listas privadas con el plan básico')
    }

    dto.slug = titleSlugified
    const newList = new this.listModel(dto)
    newList.owner = user._id

    await newList.save();
    return {
      status: 'OK',
      statusCode: 201,
      message: 'Lista creada correctamente',
      result: newList
    }
  }


  /**
   *
   * @param page
   * @param limit
   * @description Retorna todas las listas. Privadas y Públicas. Solo admin.
   * `/list`
   */
  public async findAllAdmin(page = 1, limit = 10, user: User) {
    const total = await this.listModel.countDocuments().exec();
    const totalPages = Math.ceil(total / limit);
    const admin = isAdmin(user.roles.toString());

    const lists = await this.listModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', '_id username alias')
      .populate('books', '_id title coverUrl author genre')
      .exec()

    if (admin) {
      if (total === 0) throw new NotFoundException('No se ha encontrado listas');
      return {
        results: lists,
        limit,
        page,
        totalPages,
        totalDocs: total,
      }
    } else {
      throw new ForbiddenException('Acceso denegado')
    }
  }

  /**
   *
   * @param page
   * @param limit
   * @param user
   *
   * Retornar todas las listas de un usuario propietario. `/list/my-lists` el id del usuario
   * se recoge por TOKEN
   */
  public async findAllOwner(page = 1, limit = 10, id: string) {
    const total = await this.listModel.countDocuments({ owner: id }).exec();
    const totalPages = Math.ceil(total / limit);
    const results = await this.listModel
      .find({ owner: id })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', '_id username alias')
      .populate('books', '_id title author genre')
      .populate('registeredBy', '_id username email')
      .exec()

    if (!results) {
      return {
        message: 'No tiene aún ninguna lista'
      }
    }

    return {
      results,
      limit,
      page,
      totalPages,
      totalDocs: total,
    }
  }


  /**
   * @description Retorna todas las listas públicas `isPublic: true` de un usuario
   * `/list/user/{userId}/`
   */
  public async findAllUser(page = 1, limit = 10, id: string, user: User) {
    const admin = isAdmin(user.roles.toString())

    if (admin) {
      const totalPublic = await this.listModel.countDocuments({ owner: id }).exec();
      const totalPages = Math.ceil(totalPublic / limit);
      const results = await this.listModel
        .find({ owner: id })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('owner', '_id username alias')
        .populate('books', '_id title author genre')
        .populate('registeredBy', '_id username email')
        .exec()
      if (!results) throw new NotFoundException('No se ha encontrado listas');
      return {
        results,
        limit,
        page,
        totalPages,
        totalDocs: totalPublic,
      }
    } else {
      const totalPublic = await this.listModel.countDocuments({ owner: id, isPublic: true }).exec();
      const totalPages = Math.ceil(totalPublic / limit);
      const results = await this.listModel
        .find({ owner: id, isPublic: true })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('owner', '_id username alias')
        .populate('books', '_id title author genre')
        .populate('registeredBy', '_id username email')
        .exec()
      if (!results) throw new NotFoundException('No se ha encontrado listas');
      return {
        results,
        limit,
        page,
        totalPages,
        totalDocs: totalPublic,
      }
    }
  }

  /**
   *
   * @param page
   * @param limit
   * @param user
   *
   * @description Retorna todas las listas públicas `isPublic: true` de todos los usuario
   */
  public async findAllPublic(page = 1, limit = 10) {
    const total = await this.listModel.countDocuments({ isPublic: true }).exec();
    const totalPages = Math.ceil(total / limit);
    const results = await this.listModel
      .find({ isPublic: true })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', '_id username slug')
      .populate('books', '_id title author genre')
      .populate('registeredBy', '_id username email')
      .exec()

    if (!results) throw new NotFoundException('No se ha encontrado listas')
    return {
      results,
      limit,
      page,
      totalPages,
      totalDocs: total,
    }
  }

  public async findRandom(size = 5) {
    const randomLists = await this.listModel.aggregate(
      [
        {
          '$match': {
            'isPublic': true
          }
        },
        {
          '$sample': {
            'size': size
          }
        },
      ]
    );
    return randomLists;
  }

  /**
   *
   * @param id De la lista que se quiere mostrar
   * @param user usuario logueado en el momento de la petición. Serve para poder saber si es el propietario de las lista o no.
   * Tambíen para saber si el usuario logueado tiene rol permitido `roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"]` en caso de no ser
   * propietario
   * @description Retorna una lista pasando la id de la lista por parámetros
   * `/list/:listId`
   */
  public async findOneList(id: string, user: User) {
    const admin = isAdmin(user.roles.toString())
    const list = await this.listModel.findById(id)
    const ownerListId = list.owner.toString();
    const userId = user._id.toString();

    if (!admin && ownerListId !== userId) {
      const onlyPublicList = await this.listModel.findOne({ _id: id, isPublic: true })
      if (!onlyPublicList) throw new ForbiddenException('Lista privada');
      return onlyPublicList;
    } else {
      const list = await this.listModel.findById(id);
      if (!list) throw new NotFoundException('No hay lista que mostrar');
      return list
    }
  }



  public async update(id: string, dto: UpdateListDto, user: User) {
    const list = await this.listModel.findById(id);
    const admin = isAdmin(user.roles.toString());
    const ownerListId = list.owner.toString();
    const userId = user._id.toString();
    if (!list) throw new NotFoundException('No se ha podido obtener la lista');

    if (!admin && ownerListId !== userId) {
      throw new ForbiddenException('Forbidden')
    } else {
      const updatedList = await this.listModel.findByIdAndUpdate(id, dto, { new: true });
      return {
        status: 'OK',
        statusCode: 200,
        message: `Lista ${updatedList.title} ha sido modificada`,
        result: updatedList
      }
    }
  }

  public async remove(id: string, user: User) {
    const list = await this.listModel.findById(id);
    const admin = isAdmin(user.roles.toString());
    const ownerListId = list?.owner.toString();
    const userId = user._id.toString();
    if (!list) throw new NotFoundException('No se ha podido eliminar la lista o la lista no existe');

    if (!admin && ownerListId !== userId) {
      throw new ForbiddenException('Forbidden')
    } else {
      const deletedList = await this.listModel.findByIdAndDelete(id);
      if (!deletedList) throw new NotFoundException('Lista no encontrada')
      return {
        status: 'OK',
        statusCode: 200,
        message: `Lista ${deletedList.title} ha sido eliminada`,
        result: deletedList
      }
    }
  }

}
