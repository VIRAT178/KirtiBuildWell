import mongoose from 'mongoose'

let cachedConnection: Promise<typeof mongoose> | null = null

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose
  }

  if (!cachedConnection) {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kirtibuildwell'
    cachedConnection = mongoose.connect(uri)
  }

  await cachedConnection
  console.log('MongoDB connected')
  return mongoose
}
