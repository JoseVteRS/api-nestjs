import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ModelEnum } from '@Common/enums/models.enum'
import { User } from '@Users/interfaces/user.interface';
import { CreateFollowDto } from '@Follow/dto/create-follow.dto';
import { Follow } from '@Follow/entities/follow.entity';

@Injectable()
export class FollowService {

  constructor(
    @InjectModel(ModelEnum.FOLLOW) private readonly followModel: Model<Follow>
  ) { }

  async follow(dto: CreateFollowDto, user: User) {
    const checkIfFollowing = await this.followModel.findOne({ followed: dto.followed, userId: user._id })
    if (dto.followed === user._id.toString()) throw new BadRequestException('No se puede seguir a uno mismo');
    if (checkIfFollowing) throw new BadRequestException('Ya sigue a este usuario');
    const follow = new this.followModel({ ...dto, userId: user._id })
    const newFollow = await follow.save()
    return newFollow
  }

  async unfollow(followed: string, user: User) {
    const unfollow = await this.followModel.findOneAndRemove({ followed, userId: user._id })
    if (!unfollow) return
    return unfollow;
  }

  async following(user: User) {
    const following = await this.followModel.find({ userId: user._id })
      .populate('followed', 'username alias')
    if (!following) throw new NotFoundException('No sigue a nadie');
    return following;
  }

  async followers(user: User) {
    const followers = await this.followModel.find({ followed: user._id })
      .populate('userId', 'username alias')
    if (!followers) throw new NotFoundException('No sigue a nadie');
    return followers;
  }

}
