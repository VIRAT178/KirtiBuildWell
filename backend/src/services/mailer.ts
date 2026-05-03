import nodemailer from 'nodemailer'
import { User } from '../models/User'
import { Activity } from '../models/Activity'

type ConfirmationPayload = {
  name: string
  email: string
  phone?: string
  message?: string
  propertyTitle?: string
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

function createTransporter() {
  const host = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.in'
  const port = Number(process.env.ZOHO_SMTP_PORT || 587)
  const user = process.env.ZOHO_SMTP_USER
  const pass = process.env.ZOHO_SMTP_PASS

  if (!user || !pass) {
    console.error('SMTP credentials missing:', { user: !!user, pass: !!pass })
    throw new Error('Zoho SMTP credentials are missing')
  }

  console.log(` Creating SMTP transporter for ${user} on ${host}:${port}`)

  // Try multiple configurations for better compatibility
  const configs = [
    {
      // Primary configuration
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development',
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      tls: { rejectUnauthorized: false }
    },
    {
      // Fallback configuration 1 - without service name
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      debug: process.env.NODE_ENV === 'development',
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      tls: { rejectUnauthorized: false }
    },
    {
      // Fallback configuration 2 - with explicit service
      service: 'zoho',
      auth: { user, pass },
      debug: process.env.NODE_ENV === 'development',
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      tls: { rejectUnauthorized: false }
    }
  ]

  // Try each configuration until one works
  for (let i = 0; i < configs.length; i++) {
    try {
      const transporter = nodemailer.createTransport(configs[i] as any)
      console.log(`SMTP transporter created with configuration ${i + 1}`)
      return transporter
    } catch (error) {
      console.error(`Configuration ${i + 1} failed:`, error)
      if (i === configs.length - 1) {
        throw error
      }
    }
  }

  throw new Error('All SMTP configurations failed')
}

// Timeout wrapper function
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)), timeoutMs)
  })
  
  return Promise.race([promise, timeoutPromise])
}

// Robust email sending with retry logic
async function sendEmailWithRetry(transporter: any, mailOptions: any, maxRetries: number = 3): Promise<any> {
  let lastError: any
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email send attempt ${attempt}/${maxRetries}`)
      
      const result = await withTimeout(
        transporter.sendMail(mailOptions),
        30000, // 30 second timeout per attempt
        `Email send attempt ${attempt}`
      )
      
      console.log('Email sent successfully:', (result as any).messageId)
      return result
    } catch (error) {
      lastError = error
      console.error(`Email send attempt ${attempt} failed:`, error)
      
      // Don't retry on authentication errors
      if ((error as any).message && (error as any).message.includes('authentication')) {
        throw error
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        console.log(`Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
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
          <p style="margin: 10px 0 0; color: #2c3e50; font-size: 14px;">Call us at: <strong>+91-XXXXXXXXXX</strong></p>
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
    // Simple direct SMTP approach
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS
      },
      debug: false,
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      tls: { rejectUnauthorized: false }
    } as any)

    const fromAddress = process.env.ZOHO_SMTP_USER || 'info@kirtibuildwell.com'
    const fromName = process.env.ZOHO_SMTP_FROM_NAME || 'KirtiBuildWell'
    
    // Use the existing email format
    const htmlContent = generateSimpleConfirmationEmail(payload)
    
    const result = await transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: payload.email,
      subject: 'Thank you for your inquiry - KirtiBuildWell',
      html: htmlContent,
      text: `Hi ${payload.name},\n\nThank you for contacting KirtiBuildWell. Our team will get back to you shortly.\n\nRegards,\nKirtiBuildWell Team`
    })
    
    console.log('✅ Lead confirmation email sent successfully:', result.messageId)
    
  } catch (error) {
    console.error('❌ Lead confirmation email failed:', error)
    // Don't block the process, just log the error
    console.log('📝 Email delivery failed but process continues')
  }
}

export async function sendLeadFollowUpEmail(payload: FollowUpPayload): Promise<void> {
  console.log('📧 Sending follow-up email to:', payload.email)
  
  try {
    // Simple direct SMTP approach
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS
      },
      debug: false,
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      tls: { rejectUnauthorized: false }
    } as any)

    const fromAddress = process.env.ZOHO_SMTP_USER || 'info@kirtibuildwell.com'
    const fromName = process.env.ZOHO_SMTP_FROM_NAME || 'KirtiBuildWell'

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
            <strong>Call us at +91-XXXXXXXXXX</strong>
          </p>
        </div>
      </div>
    `

    const result = await transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: payload.email,
      subject: 'Quick follow-up on your inquiry - KirtiBuildWell',
      html: followUpHtml,
      text: `Hi ${payload.name},\n\nWe wanted to follow up regarding your property inquiry. If you would like, we can schedule a quick call and share matching project options.\n\nCall us at +91-XXXXXXXXXX or reply to this email to schedule a convenient time.\n\nRegards,\nKirtiBuildWell Team`
    })
    
    console.log('✅ Follow-up email sent successfully:', result.messageId)
    
  } catch (error) {
    console.error('❌ Follow-up email failed:', error)
    // Don't block the process, just log the error
    console.log('📝 Follow-up email delivery failed but process continues')
  }
}

export async function sendAdminNotificationEmail(payload: AdminNotificationPayload): Promise<void> {
  console.log('📧 Sending admin notification email for lead:', payload.leadName)
  
  try {
    // Simple direct SMTP approach
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS
      },
      debug: false,
      connectionTimeout: 30000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      tls: { rejectUnauthorized: false }
    } as any)

    const baseUrl = getBaseUrl()
    const fromAddress = process.env.ZOHO_SMTP_USER || 'info@kirtibuildwell.com'
    const fromName = process.env.ZOHO_SMTP_FROM_NAME || 'KirtiBuildWell'

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

    const result = await transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: adminEmails,
      subject: `🔥 New Lead Alert: ${payload.leadName} - KirtiBuildWell`,
      html: adminHtml,
      text: `New Lead Alert!\n\nName: ${payload.leadName}\nEmail: ${payload.leadEmail}\nPhone: ${payload.leadPhone}\n${payload.propertyTitle ? `Project: ${payload.propertyTitle}\n` : ''}${payload.leadMessage ? `Message: "${payload.leadMessage}"\n\n` : ''}View details: ${baseUrl}/admin/leads/${payload.leadId}`
    })
    
    console.log('✅ Admin notification email sent successfully:', result.messageId)
    
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
