// import { Schema } from 'mongoose'

// export const UserSchema = new Schema({
// 	uid: {type: String, required: true, trim: true},
// 	username: { type: String, required: true, trim: true },
// 	alias: { type: String, required: true, trim: true },
// 	email: {
// 		type: String,
// 		trim: true,
// 		lowercase: true,
// 		unique: true,
// 		required: 'Email address is required',
// 		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
// 	},
// 	password: { type: String, required: true, trim: true, minlength: 6 },
// 	uriAvatar: { type: String, required: false, trim: true },
// 	genre: { type: String, required: false, trim: true },
// 	secretKeyConfirmation: { type: String, required: false, trim: true },
// 	isAdmin: { type: Boolean, required: false, trim: true, default: false },
// 	roles: [{ type: String, required: false, trim: true, default: 'USER' }],
// 	isValid: { type: Boolean, required: false, trim: true, default: false },
// 	isPublic: { type: Boolean, required: false, trim: true, default: true },
// 	isVerifiedAccount: { type: Boolean, required: false, trim: true, default: false },
// 	createdAt: { type: Date, required: false, trim: true, default: Date.now },
// 	updatedAt: { type: Date, required: false, trim: true },
// })

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AppRoles } from '../../../app.roles';


@Schema()
export class User extends Document {

	@Prop({ type: String, trim: true })
	uid: string;

	@Prop({ type: String, trim: true, required: true })
	username: string;

	@Prop({ type: String, trim: true, required: true })
	alias: string;

	@Prop({ type: String, trim: true, lowercase: true, unique: true, required: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] })
	email: string;

	@Prop({ type: String, trim: true, required: true })
	password: string;

	@Prop({ type: String, trim: true })
	uriAvatar: string;

	@Prop({ type: String, trim: true })
	genre: string;

	@Prop({ type: Array, trim: true, default: AppRoles.BASIC_USER })
	roles: string[];

	@Prop({ type: Boolean, trim: true, default: false })
	isValid: boolean;

	@Prop({ type: Boolean, trim: true, default: true })
	isPublic: boolean;

	@Prop({ type: Boolean, trim: true, default: false })
	isVerifiedAccount: boolean;

	@Prop({ type: Date, trim: true, default: Date.now })
	createdAt: Date;

	@Prop({ type: Date, trim: true })
	updatedAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);
