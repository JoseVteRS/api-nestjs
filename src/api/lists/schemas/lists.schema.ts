import { Schema } from 'mongoose';

export const ListSchema = new Schema({

  title: { type: String, required: true, trim: true },
  slug: { type: String, required: false, trim: true },
  description: { type: String, required: false, trim: true },
  books: [{ type: Schema.Types.ObjectId, ref: 'Book', require: true }],
  isPublic: { type: Boolean, require: false, default: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  versionKey: false
})
