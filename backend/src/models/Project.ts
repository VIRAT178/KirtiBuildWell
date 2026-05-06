import mongoose from 'mongoose'

export interface IProject extends mongoose.Document {
  title: string
  location: string
  price: number
  priceLabel?: string
  excerpt?: string
  description: string
  images: string[]
  amenities: string[]
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new mongoose.Schema<IProject>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters'],
    maxlength: [150, 'Title must be at most 150 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [2, 'Location must be at least 2 characters'],
    maxlength: [200, 'Location must be at most 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be greater than or equal to 0']
  },
  priceLabel: {
    type: String,
    trim: true,
    maxlength: [50, 'Price label must be at most 50 characters']
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [250, 'Excerpt must be at most 250 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [5000, 'Description must be at most 5000 characters']
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: (arr: string[]) => arr.every((item) => /^https?:\/\//.test(item) || /^data:image\//.test(item)),
      message: 'Images must contain valid HTTP/HTTPS URLs or data image URLs'
    }
  },
  amenities: {
    type: [String],
    default: [],
    validate: {
      validator: (arr: string[]) => arr.every((item) => item.trim().length > 0),
      message: 'Amenities cannot contain empty values'
    }
  }
}, { timestamps: true })

export const Project = mongoose.model<IProject>('Project', ProjectSchema)
