import { Schema } from 'mongoose';

export const BookSchema = new Schema({

	title: { type: String, required: true, trim: true },
	slug: { type: String, required: false, trim: true },
	sinopsis: { type: String, required: false, trim: true },
	author: [{ type: Schema.Types.ObjectId, ref: 'Author', require: true }],
	genre: [{ type: Schema.Types.ObjectId, ref: 'Genre', require: true }],
	coverUrl: { type: String, required: false },
	isbn10: { type: String, required: false },
	isbn13: { type: String, required: false },
	isPublic: { type: Boolean, require: false, default: true },
	registeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
	timestamps: true,
	versionKey: false
})

