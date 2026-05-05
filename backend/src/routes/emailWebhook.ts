import express from 'express'
import { sendEmailViaSMTP } from '../services/mailer'

const router = express.Router()

// Email webhook endpoint to handle email delivery
router.post('/', async (req, res) => {
  try {
    console.log('📧 Email webhook received:', {
      to: req.body.to,
      subject: req.body.subject,
      timestamp: new Date().toISOString()
    })

    const { to, subject, htmlContent, textContent } = req.body

    if (!to || !subject || !textContent) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, textContent' 
      })
    }

    const messageId = await sendEmailViaSMTP(
      to,
      subject,
      htmlContent || textContent,
      textContent
    )

    console.log('✅ Email sent via webhook:', messageId)
    
    res.status(200).json({ 
      success: true, 
      messageId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Email webhook failed:', error)
    
    res.status(500).json({ 
      error: 'Email sending failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
})

export default router
