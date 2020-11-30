import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '@Like/entities/like.entity';
import { User } from '@Users/interfaces/user.interface';


@Injectable()
export class LikeService {

  constructor(
    @InjectModel('Like') private readonly likeModel: Model<Like>
  ) { }

  async like(dto: CreateLikeDto, user: User) {
    dto.like = true;
    dto.userId = user._id;
    const like = await this.likeModel.create(dto)
    return {
      like,
      ...dto
    }
  }

  async existLike(dto: CreateLikeDto, user: User) {
    const disLike = await this.likeModel
      .findOne({ userId: user._id, entityId: dto.entityId }, function (err, like) {
        like.like = !like.like;
        like.save(function (err, updatedLike) {
          return updatedLike
        })
      })
    return {
      disLike
    }
  }

  /**
   *
   * @description Una vez creado el like no se elimina de la base de datos, solo se irá actualizando según like o dislike
   * @param dto
   * @param user
   */
  async likeOrDislike(dto, user) {
    const find = this.likeModel.findOne({ userId: user._id, entityId: dto.entityId }).exec(async (err, like) => {
      if (err) throw new BadRequestException('Un error');
      if (!like) {
        return await this.like(dto, user);
      } else {
        return await this.existLike(dto, user);
      }
    })
    return find;
  }

  async countLikeEntity(entityId: string) {
    const countlikes = await this.likeModel.countDocuments({ entityId: entityId, like: true }).exec()
    return countlikes
  }
}
