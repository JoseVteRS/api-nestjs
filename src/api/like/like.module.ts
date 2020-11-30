import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeSchema } from './schemas/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'Like', schema: LikeSchema }
      ]
    )
  ],
  controllers: [LikeController],
  providers: [LikeService]
})
export class LikeModule { }
