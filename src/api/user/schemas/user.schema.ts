import { Schema } from 'mongoose'

export const UserSchema = new Schema({
	uid: { type: String, required: true, trim: true },
	username: { type: String, required: true, trim: true },
	alias: { type: String, required: true, trim: true },
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: 'Email address is required',
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
	},
	password: { type: String, required: true, trim: true, minlength: 6 },
	uriAvatar: { type: String, required: false, trim: true },
	genre: { type: String, required: false, trim: true },
	secretKeyConfirmation: { type: String, required: false, trim: true },
	isAdmin: { type: Boolean, required: false, trim: true, default: false },
	roles: [{ type: String, required: false, trim: true, default: 'BASIC_USER' }],
	active: { type: Boolean, required: false, trim: true, default: false },
	isPublic: { type: Boolean, required: false, trim: true, default: true },
	isVerifiedAccount: { type: Boolean, required: false, trim: true, default: false },
}, {
	timestamps: true,
	versionKey: false
})