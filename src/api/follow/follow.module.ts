import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowSchema } from './schemas/follow.schema';
import { ModelEnum } from '../common/enums/models.enum';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: ModelEnum.FOLLOW, schema: FollowSchema }
      ]
    )
  ],
  controllers: [FollowController],
  providers: [FollowService]
})
export class FollowModule { }
