import { Document } from 'mongoose';

import { User } from './../../user/interfaces/user.interface';
import { Author } from './../../author/interfaces/author.interface';
import { Genre } from './../../genre/interfaces/genre.interface';

export interface Book extends Document {
	slug: string
	title: string
	sinopsis: string
	author: Author
	genre: Genre
	coverUrl: string
	isbn10: string
	isbn13: string
	registeredBy: User
	createdAt: Date
	updatedAt: Date
}
