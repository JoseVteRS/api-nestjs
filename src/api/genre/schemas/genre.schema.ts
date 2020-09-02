import { Schema } from 'mongoose';

export const GenreSchema = new Schema({
	genreName: { type: String, required: true },
	slug: { type: String, required: false },
	uriPhoto: { type: String, required: false },
	registeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, required: false },
});