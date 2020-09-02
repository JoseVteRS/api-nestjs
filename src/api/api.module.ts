import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthorModule } from './author/author.module';
import { GenreModule } from './genre/genre.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [UserModule, AuthorModule, GenreModule, BookModule]
})
export class ApiModule {}
