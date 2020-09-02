import { User } from './../../user/interfaces/user.interface';

import { Document } from 'mongoose';

export interface Genre extends Document {
	slug: string
	genreName: string
	uriPhoto: string
	registeredBy: User
	createdAt: string
	updatedAt: string
}