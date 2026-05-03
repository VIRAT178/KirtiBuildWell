import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { connectDB } from './lib/mongo'
import authRoutes from './routes/auth'
import propertyRoutes from './routes/properties'
import leadRoutes from './routes/leads'
import analyticsRoutes from './routes/analytics'
import testZohoRoutes from './routes/test-zoho'
import testEmailRoutes from './routes/test-email'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { sanitizeBody } from './middleware/validation'
import { startLeadFollowUpScheduler } from './schedulers/leadFollowUpScheduler'

dotenv.config()

const app = express()

// ========================
// 🔐 MIDDLEWARE
// ========================
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(sanitizeBody)

// ========================
// 🧪 ROOT + HEALTH
// ========================
app.get('/', (req, res) => {
  res.send('KirtiBuildWell API is running 🚀')
})

app.head('/', (req, res) => {
  res.status(200).end()
})

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API running',
    time: new Date().toISOString()
  })
})

// ========================
// 🪵 REQUEST LOG
// ========================
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`)
  next()
})

// ========================
// 🔗 API ROUTES
// ========================
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/test-zoho', testZohoRoutes)
app.use('/api/test-email', testEmailRoutes)

// ========================
// 🔥 ZOHO OAUTH CALLBACK
// ========================
app.get('/auth/zoho/callback', async (req, res) => {
  try {
    const code = req.query.code as string

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Authorization code missing"
      })
    }

    console.log("🔥 AUTH CODE:", code.substring(0, 15) + "...")

    // ✅ EXACT MATCH with Zoho console
    const REDIRECT_URI = "https://kirtibuildwell.onrender.com/auth/zoho/callback"

    const response = await fetch("https://accounts.zoho.in/oauth/v2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.ZOHO_CLIENT_ID!,
        client_secret: process.env.ZOHO_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        code: code
      })
    })

    const data = await response.json()

    console.log("📦 ZOHO RESPONSE:", data)

    // ❌ Zoho error case
    if (!data.access_token) {
      return res.status(400).json({
        success: false,
        error: "Zoho token exchange failed",
        zoho_error: data
      })
    }

    // ✅ SUCCESS
    return res.json({
      success: true,
      message: "🎉 Zoho connected successfully",
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in
      },
      next_step: `Save this → ZOHO_REFRESH_TOKEN=${data.refresh_token}`
    })

  } catch (err: any) {
    console.error("❌ OAUTH ERROR:", err)

    return res.status(500).json({
      success: false,
      error: "OAuth failed",
      details: err.message
    })
  }
})

// ========================
// ❌ 404 + ERROR
// ========================
app.use(notFoundHandler)
app.use(errorHandler)

// ========================
// 🚀 SERVER START
// ========================
const PORT = process.env.PORT || 4000

connectDB()
  .then(() => {
    startLeadFollowUpScheduler()

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error("❌ DB connection failed", err)
  })
