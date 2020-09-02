import { Document } from 'mongoose';

export interface User extends Document {
	_id: string
	uid: string
	username: string
	alias: string
	email: string
	password: string
	uriAvatar: string
	genre: string
	secretKeyConfirmation: string
	isAdmin: boolean
	roles: string[]
	isValid: boolean
	isPublic: boolean
	isVerifiedAccount: boolean
	createdAt: Date
	updatedAt: Date
}