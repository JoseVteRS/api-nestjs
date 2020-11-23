import { Document } from 'mongoose';
import { User } from './../../user/interfaces/user.interface';


export interface Author extends Document {
	_id: string,
	slug: string,
	authorName: string,
	authorBio: string,
	uriPhoto: string,
	birthday: Date,
	registeredBy: string,
};