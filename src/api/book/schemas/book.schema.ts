import { Schema } from 'mongoose';

export const BookSchema = new Schema({

	slug: { type: String, required: false, trim: true },
	title: { type: String, required: true, trim: true },
	sinopsis: { type: String, required: true, trim: true },
	author: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
	genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
	coverUrl: { type: String, required: false },
	isbn10: { type: String, required: false },
	isbn13: { type: String, required: false },
	registeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, required: false },

})