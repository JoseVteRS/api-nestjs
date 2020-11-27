import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ListSchema } from './schemas/lists.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'List', schema: ListSchema }
      ]
    )
  ],
  controllers: [ListsController],
  providers: [ListsService]
})
export class ListsModule { }
