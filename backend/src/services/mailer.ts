import { User } from '../models/User'
import { Activity } from '../models/Activity'

type ConfirmationPayload = {
  name: string
  email: string
  phone?: string
  message?: string
  propertyTitle?: string
}

type MailPayload = {
  to: string | string[]
  subject: string
  htmlContent: string
  textContent: string
}

type BrevoRecipient = {
  email: string
  name?: string
}

// Brevo HTTP send using the transactional email API
async function sendViaBrevo(to: string | string[], subject: string, htmlContent: string, textContent: string): Promise<string> {
  const apiKey = process.env.BREVO_API_KEY
  const apiUrl = process.env.BREVO_API_URL || 'https://api.brevo.com/v3/smtp/email'

  if (!apiKey) throw new Error('Brevo API key missing (BREVO_API_KEY)')

  const fromEmail = process.env.BREVO_FROM_EMAIL || 'noreply@kirtibuildwell.com'
  const fromName = process.env.BREVO_FROM_NAME || 'KirtiBuildWell'
  const replyTo = process.env.BREVO_REPLY_TO || process.env.BREVO_FROM_EMAIL || fromEmail
  const recipients = Array.isArray(to) ? to : [to]

  const payload = {
    sender: {
      name: fromName,
      email: fromEmail
    },
    replyTo: {
      email: replyTo
    },
    to: recipients.map((email): BrevoRecipient => ({ email })),
    subject,
    htmlContent,
    textContent
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
      accept: 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const responseText = await response.text()
  if (!response.ok) {
    throw new Error(`Brevo error ${response.status}: ${responseText}`)
  }

  return responseText || 'brevo-sent'
}

type FollowUpPayload = {
  name: string
  email: string
  phone?: string
}

type AdminNotificationPayload = {
  leadName: string
  leadEmail: string
  leadPhone: string
  leadMessage: string
  propertyTitle?: string
  leadId: string
}

// Get base URL for email links
function getBaseUrl(): string {
  return process.env.FRONTEND_URL || 'https://kirti-build-well.vercel.app'
}

// Unified send via Brevo (no SMTP)
export async function sendEmailViaBrevo(to: string | string[], subject: string, htmlContent: string, textContent: string): Promise<string> {
  return sendViaBrevo(to, subject, htmlContent, textContent)
}



// Simple email content generator for fallback
function generateSimpleConfirmationEmail(payload: ConfirmationPayload): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background-color: #2c3e50; padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">KirtiBuildWell</h1>
        <p style="color: #ecf0f1; margin: 5px 0 0; font-size: 14px;">Premium Real Estate Solutions</p>
      </div>
      <div style="padding: 40px 30px; background-color: #ffffff;">
        <h2 style="color: #2c3e50; margin: 0 0 15px; font-size: 20px; font-weight: 600;">Thank You for Your Inquiry</h2>
        <p style="color: #5a6c7d; margin: 0; line-height: 1.6; font-size: 16px;">Dear <strong style="color: #2c3e50;">${payload.name}</strong>,</p>
        <p style="color: #5a6c7d; line-height: 1.6; margin: 20px 0; font-size: 16px;">
          Thank you for contacting KirtiBuildWell. We have received your inquiry and our team will get back to you within <strong style="color: #27ae60;">24 hours</strong>.
        </p>
        <div style="background-color: #e9ecef; padding: 20px; border-radius: 4px; text-align: center; margin-top: 30px;">
          <p style="color: #2c3e50; margin: 0; font-size: 16px; font-weight: 600;">Need Immediate Assistance?</p>
          <p style="margin: 10px 0 0; color: #2c3e50; font-size: 14px;">Call us at: <strong>+91-8881115002</strong></p>
        </div>
      </div>
      <div style="background-color: #34495e; padding: 20px; text-align: center;">
        <p style="color: #ecf0f1; margin: 0 0 10px; font-size: 14px; font-weight: 600;">Best regards,</p>
        <p style="color: #3498db; margin: 0 0 15px; font-size: 16px; font-weight: 600;">The KirtiBuildWell Team</p>
      </div>
    </div>
  `
}

export async function sendLeadConfirmationEmail(payload: ConfirmationPayload): Promise<void> {
  console.log('📧 Sending lead confirmation email to:', payload.email)
  
  try {
    const htmlContent = generateSimpleConfirmationEmail(payload)
    const textContent = `Hi ${payload.name},\n\nThank you for contacting KirtiBuildWell. Our team will get back to you shortly.\n\nRegards,\nKirtiBuildWell Team`
    
    await sendEmailViaBrevo(
      payload.email,
      'Thank you for your inquiry - KirtiBuildWell',
      htmlContent,
      textContent
    )
    
    console.log('✅ Lead confirmation email sent successfully')
    
  } catch (error) {
    console.error('❌ Lead confirmation email failed:', error)
    // Don't block the process, just log the error
    console.log('📝 Email delivery failed but process continues')
  }
}

export async function sendLeadFollowUpEmail(payload: FollowUpPayload): Promise<void> {
  console.log('📧 Sending follow-up email to:', payload.email)
  
  try {
    const followUpHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d4af37; margin-bottom: 10px;">KirtiBuildWell</h1>
          <p style="color: #666; margin: 0;">Premium Real Estate Solutions</p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-top: 0;">Quick Follow-up on Your Inquiry</h2>
          <p style="color: #666; line-height: 1.6;">Dear ${payload.name},</p>
          <p style="color: #666; line-height: 1.6;">We wanted to follow up regarding your property inquiry. If you would like, we can schedule a quick call and share matching project options.</p>
          <p style="text-align: center; margin-top: 20px;">
            <strong>Call us at +91-8881115002</strong>
          </p>
        </div>
      </div>
    `

    const textContent = `Hi ${payload.name},\n\nWe wanted to follow up regarding your property inquiry. If you would like, we can schedule a quick call and share matching project options.\n\nCall us at +91-8881115002 or reply to this email to schedule a convenient time.\n\nRegards,\nKirtiBuildWell Team`

    await sendEmailViaBrevo(
      payload.email,
      'Quick follow-up on your inquiry - KirtiBuildWell',
      followUpHtml,
      textContent
    )
    
    console.log('✅ Follow-up email sent successfully')
    
  } catch (error) {
    console.error('❌ Follow-up email failed:', error)
    // Don't block the process, just log the error
    console.log('📝 Follow-up email delivery failed but process continues')
  }
}

export async function sendAdminNotificationEmail(payload: AdminNotificationPayload): Promise<void> {
  console.log('📧 Sending admin notification email for lead:', payload.leadName)
  
  try {
    const baseUrl = getBaseUrl()

    // Get all admin users
    const adminUsers = await User.find({ role: 'admin' }).lean()
    const adminEmails = adminUsers.map(user => user.email)

    if (adminEmails.length === 0) {
      console.warn('No admin users found to send notification email')
      return
    }

    // Simple admin notification HTML
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #dc3545; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">🔥 New Lead Alert</h1>
          <p style="color: #f8f9fa; margin: 5px 0 0; font-size: 14px;">KirtiBuildWell Admin Notification</p>
        </div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h3 style="color: #2c3e50; margin: 0 0 15px; font-size: 16px; font-weight: 600;">Lead Details</h3>
          <p><strong>Name:</strong> ${payload.leadName}</p>
          <p><strong>Email:</strong> ${payload.leadEmail}</p>
          <p><strong>Phone:</strong> ${payload.leadPhone}</p>
          ${payload.propertyTitle ? `<p><strong>Project:</strong> ${payload.propertyTitle}</p>` : ''}
          ${payload.leadMessage ? `<p><strong>Message:</strong> "${payload.leadMessage}"</p>` : ''}
          <p><strong>View Details:</strong> <a href="${baseUrl}/admin/leads/${payload.leadId}">Click here</a></p>
        </div>
      </div>
    `

    const textContent = `New Lead Alert!\n\nName: ${payload.leadName}\nEmail: ${payload.leadEmail}\nPhone: ${payload.leadPhone}\n${payload.propertyTitle ? `Project: ${payload.propertyTitle}\n` : ''}${payload.leadMessage ? `Message: "${payload.leadMessage}"\n\n` : ''}View details: ${baseUrl}/admin/leads/${payload.leadId}`

    await sendEmailViaBrevo(
      adminEmails,
      `🔥 New Lead Alert: ${payload.leadName} - KirtiBuildWell`,
      adminHtml,
      textContent
    )
    
    console.log('✅ Admin notification email sent successfully')
    
    // Log activity
    await Activity.create({
      type: 'email_sent',
      description: `Admin notification sent for new lead: ${payload.leadName}`,
      leadId: payload.leadId,
      metadata: { recipientCount: adminEmails.length, recipients: adminEmails }
    })
    
  } catch (error) {
    console.error('❌ Admin notification email failed:', error)
    // Don't block the process, just log the error
    console.log('📝 Admin email delivery failed but process continues')
  }
}
