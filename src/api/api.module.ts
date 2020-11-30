import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthorModule } from './author/author.module';
import { GenreModule } from './genre/genre.module';
import { BookModule } from './book/book.module';
import { ListsModule } from './lists/lists.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';


@Module({
  imports: [UserModule, AuthorModule, GenreModule, BookModule, ListsModule, LikeModule, FollowModule]
})
export class ApiModule { }
