import mongoose from 'mongoose'

export interface IProperty extends mongoose.Document {
  title: string
  location?: string
  price?: string
  images?: string[]
  excerpt?: string
}

const PropertySchema = new mongoose.Schema<IProperty>({
  title: { type: String, required: true },
  location: { type: String },
  price: { type: String },
  images: [{ type: String }],
  excerpt: { type: String }
}, { timestamps: true })

export const Property = mongoose.model<IProperty>('Property', PropertySchema)
