import { Router } from 'express'
import { sendLeadConfirmationEmail } from '../services/mailer'

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
    
    await sendLeadConfirmationEmail({
      name,
      email,
      phone: '+91-XXXXXXXXXX',
      message: 'This is a test email from KirtiBuildWell email service.',
      propertyTitle: 'Test Project'
    })

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
