
import { Document } from 'mongoose';

export interface Genre extends Document {
	slug: string
	genreName: string
	uriPhoto: string
	registeredBy: string
	createdAt: string
	updatedAt: string
}