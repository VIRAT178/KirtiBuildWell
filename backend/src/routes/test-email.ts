import { Router } from 'express'
import { sendEmailViaBrevo } from '../services/mailer'
import { User } from '../models/User'

const router = Router()

// Test email endpoint
router.post('/test', async (req, res) => {
  try {
    const { email, name, type } = req.body
    
    if (!name) {
      return res.status(400).json({
        error: 'Name is required'
      })
    }

    if (type === 'admin') {
      const adminUsers = await User.find({ role: 'admin' }).lean()
      const adminEmails = adminUsers.map(user => user.email)

      if (adminEmails.length === 0) {
        return res.status(400).json({ error: 'No admin users found' })
      }

      console.log(`Testing admin email delivery to: ${adminEmails.join(', ')}`)

      await sendEmailViaBrevo(
        adminEmails,
        'KirtiBuildWell admin email test',
        `
          <div style="font-family: Arial, sans-serif; padding: 24px;">
            <h2 style="margin: 0 0 12px;">KirtiBuildWell Admin Email Test</h2>
            <p style="margin: 0 0 8px;">Hello ${name},</p>
            <p style="margin: 0;">This is a test admin notification email from the KirtiBuildWell backend.</p>
          </div>
        `,
        `Hello ${name},\n\nThis is a test admin notification email from the KirtiBuildWell backend.`
      )

      return res.json({
        success: true,
        message: 'Admin test email sent successfully',
        recipients: adminEmails
      })
    }

    if (!email) {
      return res.status(400).json({
        error: 'Email is required for user test emails'
      })
    }

    console.log(`Testing user email delivery with ${email}`)
    
    await sendEmailViaBrevo(
      email,
      'KirtiBuildWell user email test',
      `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h2 style="margin: 0 0 12px;">KirtiBuildWell User Email Test</h2>
          <p style="margin: 0 0 8px;">Hello ${name},</p>
          <p style="margin: 0;">This is a test email from the KirtiBuildWell backend.</p>
        </div>
      `,
      `Hello ${name},\n\nThis is a test email from the KirtiBuildWell backend.`
    )

    res.json({
      success: true,
      message: 'User test email sent successfully'
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
