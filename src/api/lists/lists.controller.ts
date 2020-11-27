import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { Auth } from '../../common/decorators';
import { AppResource, AppRoles } from '../../app.roles';
import { UserRequest } from '../../common/decorators/user.decorator';
import { User } from '../user/interfaces/user.interface';
import { RolesBuilder, InjectRolesBuilder } from 'nest-access-control';


@Controller('list')
export class ListsController {
  constructor(
    private readonly listsService: ListsService,
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder
  ) { }

  @Auth({
    possession: 'own',
    action: 'create',
    resource: AppResource.LIST,
  })
  @Post()
  async create(
    @UserRequest() user: User,
    @Body() dto: CreateListDto
  ) {
    return await this.listsService.create(dto, user);
  }
  /**
   *
   * @description Retorna todas las listas de todos los usuarios si y solo si el usuario es admin.
   * Se verifica por `Authorization: Bearer token`
   */
  @Auth({
    possession: 'any',
    action: 'read',
    resource: AppResource.LIST,
  })
  @Get()
  public async findAllAdmin(
    @UserRequest() user: User,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const listAdmin = await this.listsService.findAllAdmin(+page, +limit, user);
    return {
      results: listAdmin
    }
  }


  @Auth()
  @Get('test')
  public async findAll(
    @UserRequest() user: User,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const listAdmin = await this.listsService.findAllAdmin(+page, +limit, user);
    return listAdmin

  }

  /**
   * @description Retorna todas las listas de un usuario si y solo si es propietarios.
   * Se retornan las listas públicas y privadas
   */

  @Auth({
    possession: 'own',
    action: 'read',
    resource: AppResource.LIST,
  })
  @Get('my-lists')
  public async findAllOwner(
    @UserRequest() user: User,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const lists = await this.listsService.findAllOwner(+page, +limit, user._id)
    return lists;
  }



  @Get('random')
  public async findRandom(
    @Query('size') size: number
  ) {
    const lists = await this.listsService.findRandom(+size)
    return lists;
  }

  @Auth()
  @Get('user/:userId')
  public async findAllUser(
    @UserRequest() user: User,
    @Param('userId') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const lists = await this.listsService.findAllUser(+page, +limit, id, user);
    return lists;
  }


  /**
   *
   * @param id
   * @description Retorna una lista pública o privada si el usuario es el propietario
   * `owner: true`
   */
  @Auth({
    possession: 'any',
    action: 'read',
    resource: AppResource.LIST,
  })
  @Get(':id')
  public async findOneList(
    @Param('id') id: string,
    @UserRequest() user: User
  ) {
    const list = await this.listsService.findOneList(id, user);
    return list;
  }



  /**
   *
   * @param id
   * @description Retorna una lista de un usuario siempre que esta se pública
   * `isPublic: true`
   */
  @Get('/:listId/user/:userId')
  findOneByUser(@Param('id') id: string) {
    return 'hola'
  }


  @Auth({
    possession: 'own',
    action: 'update',
    resource: AppResource.LIST,
  })
  @Put(':id')
  public async update(
    @Param('id') id: any,
    @Body() dto: UpdateListDto,
    @UserRequest() user: User
  ) {
    // let data: any;
    // const rule = this.rolesBuilder.can(user.roles).updateAny(AppResource.LIST).granted;
    const updatedList = await this.listsService.update(id, dto, user);
    return updatedList;
  }


  @Auth({
    possession: 'own',
    action: 'delete',
    resource: AppResource.LIST,
  })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserRequest() user: User

  ) {
    const deletedList = this.listsService.remove(id, user);
    return deletedList;
  }
}
