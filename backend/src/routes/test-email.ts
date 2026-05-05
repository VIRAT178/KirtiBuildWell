import { Router } from 'express'
import { sendEmailViaSMTP } from '../services/mailer'

const router = Router()

// Test email endpoint
router.post('/test', async (req, res) => {
  try {
    const { email, name } = req.body
    
    if (!email || !name) {
      return res.status(400).json({
        error: 'Email and name are required'
      })
    }

    console.log(`Testing email service with ${email}`)
    
    await sendEmailViaSMTP(
      email,
      'KirtiBuildWell email test',
      `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h2 style="margin: 0 0 12px;">KirtiBuildWell Email Test</h2>
          <p style="margin: 0 0 8px;">Hello ${name},</p>
          <p style="margin: 0;">This is a test email from the KirtiBuildWell backend.</p>
        </div>
      `,
      `Hello ${name},\n\nThis is a test email from the KirtiBuildWell backend.`
    )

    res.json({
      success: true,
      message: 'Test email sent successfully'
    })
  } catch (error) {
    console.error('Test email failed:', error)
    res.status(500).json({
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
