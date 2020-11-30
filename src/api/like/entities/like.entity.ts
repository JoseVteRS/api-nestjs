import { Document } from 'mongoose';

export class Like extends Document {
  entityType?: string
  entityId?: string
  userId?: string
  like?: boolean
}
