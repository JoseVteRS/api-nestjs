import { Schema } from 'mongoose';

export const FollowSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  followed: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
  versionKey: false
})
