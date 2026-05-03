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
import { exchangeZohoAuthorizationCode } from './services/zoho'

dotenv.config()

const app = express()

// Security middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(sanitizeBody)

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${req.ip}`)
  next()
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/test-zoho', testZohoRoutes)
app.use('/api/test-email', testEmailRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KirtiBuildWell API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})
app.get('/auth/zoho/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    const redirectUri = req.query.redirect_uri as string || 'http://localhost:4000/auth/zoho/callback';

    console.log("🔥 Zoho Authorization Code received:", code?.substring(0, 20) + "...");

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Authorization code is required"
      });
    }

    // Exchange the authorization code for tokens
    const tokenData = await exchangeZohoAuthorizationCode(code, redirectUri);

    res.json({
      success: true,
      message: "Tokens exchanged successfully",
      data: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        api_domain: tokenData.api_domain,
        token_type: tokenData.token_type
      },
      instructions: {
        refresh_token: "Update your .env file with ZOHO_REFRESH_TOKEN=" + tokenData.refresh_token,
        note: "The refresh token can be used to get new access tokens without user authorization"
      }
    });
  } catch (error) {
    console.error("❌ Zoho OAuth callback error:", error);
    
    res.status(500).json({
      success: false,
      error: "Failed to exchange authorization code",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// 404 handler
app.use(notFoundHandler)

// Error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 4000

connectDB()
  .then(() => {
    startLeadFollowUpScheduler()
    const server = app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`)
    })
    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or set PORT in .env`)
      } else {
        console.error(err)
      }
      process.exit(1)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err)
  })
