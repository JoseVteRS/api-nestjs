import { Schema } from 'mongoose';
import { TypeLike } from '@Like/enums/type-like.enum';


export const LikeSchema = new Schema({
  entityType: { type: String, enum: Object.values(TypeLike), required: true, trim: true },
  entityId: { type: Schema.Types.ObjectId, required: true, refPath: 'entityType', entityType: Object.values(TypeLike) },
  userId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  like: { type: Boolean }
}, {
  timestamps: true,
  versionKey: false
});
