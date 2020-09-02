import { Schema } from 'mongoose';

export const AuthorSchema = new Schema({
	slug: { type: String, required: false, unique: true, trim: true },
	authorName: { type: String, required: true, trim: true },
	authorBio: { type: String, required: false, trim: true },
	uriPhoto: { type: String, required: false, trim: true },
	birthday: { type: Date, required: false, trim: true },
	registeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, required: false },
});