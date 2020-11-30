import { Document } from 'mongoose';

export class Follow extends Document {
  userId: string;
  followed: string
}
