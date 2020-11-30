import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { LikeService } from '@Like/like.service';
import { CreateLikeDto } from '@Like/dto/create-like.dto';
import { UpdateLikeDto } from '@Like/dto/update-like.dto';
import { Auth } from 'src/common/decorators';
import { UserRequest } from '../../common/decorators/user.decorator';
import { User } from '@Users/interfaces/user.interface';


@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateLikeDto,
    @UserRequest() user: User,
  ) {

    const like = await this.likeService.likeOrDislike(dto, user);
    return like;
  }

  @Get()
  async countLikes(
    @Query('entityId') entityId: string
  ) {
    const countLike = this.likeService.countLikeEntity(entityId);

    return countLike;
  }

}
