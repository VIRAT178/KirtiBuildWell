import app from './app'
import { connectDB } from './lib/mongo'
import { startLeadFollowUpScheduler } from './schedulers/leadFollowUpScheduler'
const PORT = process.env.PORT || 4000

connectDB()
  .then(() => {
    if (!process.env.VERCEL) {
      startLeadFollowUpScheduler()
    }

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error("❌ DB connection failed", err)
  })
