import express from 'express'
import nodemailer from 'nodemailer'

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

    // Create simple email transporter
    const smtpHost = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.in'
    const smtpPort = Number(process.env.ZOHO_SMTP_PORT || 465)
    const smtpSecure = process.env.ZOHO_SMTP_SECURE

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure ? smtpSecure === 'true' : smtpPort === 465,
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS
      },
      debug: false,
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: { rejectUnauthorized: false }
    } as any)

    // Send email
    const result = await transporter.sendMail({
      from: `KirtiBuildWell <${process.env.ZOHO_SMTP_USER}>`,
      to,
      subject,
      html: htmlContent || textContent,
      text: textContent
    })

    console.log('✅ Email sent via webhook:', result.messageId)
    
    res.status(200).json({ 
      success: true, 
      messageId: result.messageId,
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
