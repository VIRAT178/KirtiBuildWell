import mongoose from 'mongoose'

export interface IActivity extends mongoose.Document {
  type: 'lead_created' | 'lead_updated' | 'lead_deleted' | 'user_registered' | 'project_created' | 'project_updated' | 'crm_sync' | 'email_sent' | 'follow_up_sent' | 'error' | 'login' | 'logout'
  description: string
  userId?: mongoose.Types.ObjectId
  leadId?: mongoose.Types.ObjectId
  projectId?: mongoose.Types.ObjectId
  metadata?: Record<string, any>
  status: 'success' | 'failed' | 'pending'
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}

const ActivitySchema = new mongoose.Schema<IActivity>({
  type: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: ['lead_created', 'lead_updated', 'lead_deleted', 'user_registered', 'project_created', 'project_updated', 'crm_sync', 'email_sent', 'follow_up_sent', 'error', 'login', 'logout']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description must be at most 500 characters']
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },
  errorMessage: {
    type: String,
    maxlength: [1000, 'Error message must be at most 1000 characters']
  }
}, { timestamps: true })

// Index for efficient queries
ActivitySchema.index({ type: 1, createdAt: -1 })
ActivitySchema.index({ userId: 1, createdAt: -1 })
ActivitySchema.index({ leadId: 1, createdAt: -1 })
ActivitySchema.index({ projectId: 1, createdAt: -1 })

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema)
