import { Document } from 'mongoose';

export interface Book extends Document {
	title: string
	slug?: string
	sinopsis?: string
	author: string[]
	genre: string[]
	coverUrl?: string
	isbn10?: string
	isbn13?: string
	registeredBy?: string
	isPublic?: boolean
	createdAt?: Date
	updatedAt?: Date
}
