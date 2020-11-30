import { Controller, Post, Body, Delete, Query, Get } from '@nestjs/common';
import { Auth, UserRequest } from '@Src/common/decorators'
import { User } from '@Users/interfaces/user.interface';
import { FollowService } from '@Follow/follow.service';
import { CreateFollowDto } from '@Follow/dto/create-follow.dto';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) { }

  @Auth()
  @Post()
  async follow(@Body() dto: CreateFollowDto, @UserRequest() user: User) {
    return await this.followService.follow(dto, user);
  }

  @Auth()
  @Get('following')
  async followers(@UserRequest() user: User) {
    return await this.followService.following(user);
  }

  @Auth()
  @Get('followers')
  async followed(@UserRequest() user: User) {
    return await this.followService.followers(user);
  }


  @Auth()
  @Delete()
  async unfollow(
    @Query('followed') followed: string,
    @UserRequest() user: User
  ) {
    return await this.followService.unfollow(followed, user);
  }




}
