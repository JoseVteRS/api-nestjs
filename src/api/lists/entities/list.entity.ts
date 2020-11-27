import { Document } from 'mongoose';


export class List extends Document {
  title: string
  books: string[]
  slug?: string
  description?: string
  isPublic?: boolean
  owner?: string
}
