import mongoose from 'mongoose'

export interface ILead extends mongoose.Document {
  name: string
  email: string
  phone: string
  message: string
  status: 'new' | 'contacted' | 'closed'
  source: 'website'
  propertyId?: mongoose.Types.ObjectId | string
  confirmationEmailSentAt?: Date
  followUpEmailSentAt?: Date
  createdAt: Date
  updatedAt: Date
}

const LeadSchema = new mongoose.Schema<ILead>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [80, 'Name must be at most 80 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
    minlength: [7, 'Phone must be at least 7 characters'],
    maxlength: [20, 'Phone must be at most 20 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [2000, 'Message must be at most 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
    required: true
  },
  source: {
    type: String,
    enum: ['website'],
    default: 'website',
    required: true
  },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  confirmationEmailSentAt: { type: Date },
  followUpEmailSentAt: { type: Date }
}, { timestamps: true })

export const Lead = mongoose.model<ILead>('Lead', LeadSchema)
