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

function createTransporter() {
  const host = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.in'
  const port = Number(process.env.ZOHO_SMTP_PORT || 587)
  const user = process.env.ZOHO_SMTP_USER
  const pass = process.env.ZOHO_SMTP_PASS

  if (!user || !pass) {
    throw new Error('Zoho SMTP credentials are missing')
  }

  console.log(` Creating SMTP transporter for ${user} on ${host}:${port}`)

  const transporter = nodemailer.createTransport({
    service: 'zoho',
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    debug: process.env.NODE_ENV === 'development', // Enable debug logging only in development
    logger: process.env.NODE_ENV === 'development', // Enable logger only in development
    connectionTimeout: 30000, // 30 seconds connection timeout
    greetingTimeout: 10000, // 10 seconds greeting timeout
    socketTimeout: 20000, // 20 seconds socket timeout
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5,
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates in development
    }
  } as any)

  return transporter
}

// Verify transporter connection
async function verifyTransporter(transporter: any): Promise<void> {
  try {
    await withTimeout(
      transporter.verify(),
      15000, // 15 seconds timeout for verification
      'SMTP connection verification'
    )
    console.log('SMTP transporter verified successfully')
  } catch (error) {
    console.error('SMTP transporter verification failed:', error)
    throw new Error(`SMTP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Timeout wrapper function
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)), timeoutMs)
  })
  
  return Promise.race([promise, timeoutPromise])
}

export async function sendLeadConfirmationEmail(payload: ConfirmationPayload): Promise<void> {
  const transporter = createTransporter()
  const fromAddress = process.env.ZOHO_SMTP_FROM_EMAIL || process.env.ZOHO_SMTP_USER
  const fromName = process.env.ZOHO_SMTP_FROM_NAME || 'KirtiBuildWell'

  // Verify connection before sending
  await verifyTransporter(transporter)

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- Header -->
      <div style="background-color: #2c3e50; padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">KirtiBuildWell</h1>
        <p style="color: #ecf0f1; margin: 5px 0 0; font-size: 14px;">Premium Real Estate Solutions</p>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 40px 30px; background-color: #ffffff;">
        <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 20px; margin-bottom: 30px;">
          <h2 style="color: #2c3e50; margin: 0 0 15px; font-size: 20px; font-weight: 600;">Thank You for Your Inquiry</h2>
          <p style="color: #5a6c7d; margin: 0; line-height: 1.6; font-size: 16px;">Dear <strong style="color: #2c3e50;">${payload.name}</strong>,</p>
        </div>
        
        <p style="color: #5a6c7d; line-height: 1.6; margin: 0 0 20px; font-size: 16px;">
          Thank you for contacting KirtiBuildWell. We have received your inquiry and our team will get back to you within <strong style="color: #27ae60;">24 hours</strong> to discuss your requirements and provide personalized assistance.
        </p>
        
        ${payload.propertyTitle ? `
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404; font-size: 14px; font-weight: 600;">
            📍 Project of Interest: <strong>${payload.propertyTitle}</strong>
          </p>
        </div>` : ''}
        
        ${payload.phone ? `
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; color: #155724; font-size: 14px;">
            📞 We'll contact you at: <strong>${payload.phone}</strong>
          </p>
        </div>` : ''}
        
        <!-- Why Choose Us -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #2c3e50; margin: 0 0 20px; font-size: 18px; font-weight: 600;">Why Choose KirtiBuildWell?</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
              <h4 style="color: #2c3e50; margin: 0 0 8px; font-size: 14px; font-weight: 600;">🏢 Premium Projects</h4>
              <p style="margin: 0; color: #5a6c7d; font-size: 13px; line-height: 1.4;">Luxury residential properties with world-class amenities</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
              <h4 style="color: #2c3e50; margin: 0 0 8px; font-size: 14px; font-weight: 600;">🤝 Transparent Deals</h4>
              <p style="margin: 0; color: #5a6c7d; font-size: 13px; line-height: 1.4;">Honest pricing and clear documentation throughout</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
              <h4 style="color: #2c3e50; margin: 0 0 8px; font-size: 14px; font-weight: 600;">⚖️ Expert Legal</h4>
              <p style="margin: 0; color: #5a6c7d; font-size: 13px; line-height: 1.4;">Professional legal guidance and documentation support</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
              <h4 style="color: #2c3e50; margin: 0 0 8px; font-size: 14px; font-weight: 600;">🏆 After Sales Support</h4>
              <p style="margin: 0; color: #5a6c7d; font-size: 13px; line-height: 1.4;">Comprehensive post-purchase assistance and maintenance</p>
            </div>
          </div>
        </div>
        
        <!-- Contact Information -->
        <div style="background-color: #e9ecef; padding: 20px; border-radius: 4px; text-align: center;">
          <h3 style="color: #2c3e50; margin: 0 0 15px; font-size: 16px; font-weight: 600;">Need Immediate Assistance?</h3>
          <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
            <div>
              <p style="margin: 0; color: #2c3e50; font-size: 14px; font-weight: 600;">📞 Call Us</p>
              <p style="margin: 5px 0 0; color: #2c3e50; font-size: 14px;">+91-XXXXXXXXXX</p>
            </div>
            <div>
              <p style="margin: 0; color: #2c3e50; font-size: 14px; font-weight: 600;">📧 Email</p>
              <p style="margin: 5px 0 0; color: #2c3e50; font-size: 14px;">info@kirtibuildwell.com</p>
            </div>
            <div>
              <p style="margin: 0; color: #2c3e50; font-size: 14px; font-weight: 600;">📍 Office</p>
              <p style="margin: 5px 0 0; color: #2c3e50; font-size: 12px;">Meera Complex, 12, Pahad Nagar Tekariya</p>
              <p style="margin: 0; color: #2c3e50; font-size: 12px;">Lucknow, Selhu Mau, UP 226303</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #34495e; padding: 20px; text-align: center;">
        <p style="color: #ecf0f1; margin: 0 0 10px; font-size: 14px; font-weight: 600;">Best regards,</p>
        <p style="color: #3498db; margin: 0 0 15px; font-size: 16px; font-weight: 600;">The KirtiBuildWell Team</p>
        <div style="border-top: 1px solid #4a5f7a; padding-top: 15px;">
          <p style="color: #95a5a6; margin: 0; font-size: 11px;">© 2026 KirtiBuildWell. All rights reserved.</p>
          <p style="color: #95a5a6; margin: 5px 0 0; font-size: 10px;">This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </div>
  `

  await withTimeout(
    transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: payload.email,
      subject: 'Thank you for your inquiry - KirtiBuildWell',
      html: htmlContent,
      text: `Hi ${payload.name},\n\nThank you for contacting KirtiBuildWell. Our team will get back to you shortly.\n\nRegards,\nKirtiBuildWell Team`
    }),
    25000, // 25 seconds timeout for sending email
    'Lead confirmation email'
  )
}

export async function sendLeadFollowUpEmail(payload: FollowUpPayload): Promise<void> {
  const transporter = createTransporter()
  const fromAddress = process.env.ZOHO_SMTP_FROM_EMAIL || process.env.ZOHO_SMTP_USER
  const fromName = process.env.ZOHO_SMTP_FROM_NAME || 'KirtiBuildWell'

  // Verify connection before sending
  await verifyTransporter(transporter)

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #d4af37; margin-bottom: 10px;">KirtiBuildWell</h1>
        <p style="color: #666; margin: 0;">Premium Real Estate Solutions</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">Quick Follow-up on Your Inquiry</h2>
        <p style="color: #666; line-height: 1.6;">Dear ${payload.name},</p>
        <p style="color: #666; line-height: 1.6;">We wanted to follow up regarding your property inquiry. If you would like, we can schedule a quick call and share matching project options.</p>
      </div>
      
      <div style="background: #d4af37; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <h3 style="margin-top: 0;">Schedule a Consultation</h3>
        <p>Call us at <strong>+91-XXXXXXXXXX</strong></p>
        <p>or reply to this email to schedule a convenient time</p>
      </div>
      
      <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; margin: 0;">Best regards,<br><strong>The KirtiBuildWell Team</strong></p>
      </div>
    </div>
  `

  await withTimeout(
    transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: payload.email,
      subject: 'Quick follow-up on your inquiry - KirtiBuildWell',
      html: htmlContent,
      text: `Hi ${payload.name},\n\nWe wanted to follow up regarding your property inquiry. If you would like, we can schedule a quick call and share matching project options.\n\nCall us at +91-XXXXXXXXXX or reply to this email to schedule a convenient time.\n\nRegards,\nKirtiBuildWell Team`
    }),
    25000, // 25 seconds timeout for sending email
    'Lead follow-up email'
  )
}

export async function sendAdminNotificationEmail(payload: AdminNotificationPayload): Promise<void> {
  const transporter = createTransporter()
  const fromAddress = process.env.ZOHO_SMTP_FROM_EMAIL || process.env.ZOHO_SMTP_USER
  const fromName = process.env.ZOHO_SMTP_FROM_NAME || 'KirtiBuildWell'

  // Get all admin users
  const adminUsers = await User.find({ role: 'admin' }).lean()
  const adminEmails = adminUsers.map(user => user.email)

  if (adminEmails.length === 0) {
    console.warn('No admin users found to send notification email')
    return
  }

  // Verify connection before sending
  await verifyTransporter(transporter)

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- Header -->
      <div style="background-color: #dc3545; padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🔥 New Lead Alert</h1>
        <p style="color: #f8f9fa; margin: 5px 0 0; font-size: 14px;">KirtiBuildWell Admin Notification</p>
      </div>
      
      <!-- Alert Banner -->
      <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px 20px; text-align: center;">
        <h2 style="margin: 0; color: #721c24; font-size: 18px; font-weight: 600;">
          New Potential Customer Inquiry Received
        </h2>
        <p style="margin: 8px 0 0; color: #721c24; font-size: 14px;">
          A new prospect has shown interest in your properties
        </p>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 30px 20px; background-color: #ffffff;">
        <!-- Lead Details -->
        <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #2c3e50; margin: 0 0 20px; font-size: 18px; font-weight: 600; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">Lead Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 5px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #2c3e50; font-size: 14px; width: 120px;">Name:</td>
              <td style="padding: 10px 5px; border-bottom: 1px solid #dee2e6; color: #2c3e50; font-size: 14px; font-weight: 600;">${payload.leadName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 5px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #2c3e50; font-size: 14px;">Email:</td>
              <td style="padding: 10px 5px; border-bottom: 1px solid #dee2e6; color: #007bff; font-size: 14px;">${payload.leadEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px 5px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #2c3e50; font-size: 14px;">Phone:</td>
              <td style="padding: 10px 5px; border-bottom: 1px solid #dee2e6; color: #28a745; font-size: 14px; font-weight: 600;">${payload.leadPhone}</td>
            </tr>
            ${payload.propertyTitle ? `
            <tr>
              <td style="padding: 10px 5px; border-bottom: 1px solid #dee2e6; font-weight: 600; color: #2c3e50; font-size: 14px;">Project:</td>
              <td style="padding: 10px 5px; border-bottom: 1px solid #dee2e6; color: #ffc107; font-size: 14px; font-weight: 600;">${payload.propertyTitle}</td>
            </tr>` : ''}
          </table>
          
          ${payload.leadMessage ? `
          <div style="margin-top: 15px;">
            <h4 style="margin: 0 0 8px; color: #2c3e50; font-size: 14px; font-weight: 600;">Message:</h4>
            <div style="background-color: #ffffff; border: 1px solid #dee2e6; border-left: 4px solid #ffc107; padding: 12px; border-radius: 4px;">
              <p style="margin: 0; color: #5a6c7d; font-size: 14px; line-height: 1.5; font-style: italic;">"${payload.leadMessage}"</p>
            </div>
          </div>` : ''}
        </div>
        
        <!-- Action Buttons -->
        <div style="text-align: center; margin-bottom: 25px;">
          <a href="http://localhost:3000/admin/leads/${payload.leadId}" style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px; margin-bottom: 10px;">
            🚀 View Lead Details
          </a>
          <br>
          <a href="http://localhost:3000/admin/dashboard" style="display: inline-block; background-color: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 13px;">
            📊 Admin Dashboard
          </a>
        </div>
        
        <!-- Quick Actions -->
        <div style="background-color: #e9ecef; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; text-align: center;">
          <h3 style="margin: 0 0 15px; color: #2c3e50; font-size: 16px; font-weight: 600;">Quick Actions</h3>
          <div style="display: flex; justify-content: center; gap: 25px; flex-wrap: wrap;">
            <div>
              <p style="margin: 0; color: #2c3e50; font-size: 12px; font-weight: 600;">⏰ Response Time</p>
              <p style="margin: 5px 0 0; color: #28a745; font-size: 14px; font-weight: 700;">Within 24 hours</p>
            </div>
            <div>
              <p style="margin: 0; color: #2c3e50; font-size: 12px; font-weight: 600;">🎯 Priority</p>
              <p style="margin: 5px 0 0; color: #dc3545; font-size: 14px; font-weight: 700;">HIGH</p>
            </div>
            <div>
              <p style="margin: 0; color: #2c3e50; font-size: 12px; font-weight: 600;">📞 Contact Method</p>
              <p style="margin: 5px 0 0; color: #2c3e50; font-size: 14px; font-weight: 700;">Phone Call</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #343a40; padding: 20px; text-align: center;">
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
          <div style="width: 30px; height: 30px; background-color: #dc3545; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 16px; color: white;">🏢</div>
          <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: 600;">KirtiBuildWell</p>
        </div>
        <div style="border-top: 1px solid #495057; padding-top: 15px;">
          <p style="color: #6c757d; margin: 0; font-size: 11px;">© 2026 KirtiBuildWell. All rights reserved.</p>
          <p style="color: #6c757d; margin: 5px 0 0; font-size: 10px;">Automated notification generated at ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  `

  await withTimeout(
    transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: adminEmails,
      subject: `🔥 New Lead Alert: ${payload.leadName} - KirtiBuildWell`,
      html: htmlContent,
      text: `New Lead Alert!\n\nName: ${payload.leadName}\nEmail: ${payload.leadEmail}\nPhone: ${payload.leadPhone}\n${payload.propertyTitle ? `Project: ${payload.propertyTitle}\n` : ''}${payload.leadMessage ? `Message: "${payload.leadMessage}"\n\n` : ''}View details: http://localhost:3000/admin/leads/${payload.leadId}`
    }),
    25000, // 25 seconds timeout for sending email
    'Admin notification email'
  )

  // Log activity
  await Activity.create({
    type: 'email_sent',
    description: `Admin notification sent for new lead: ${payload.leadName}`,
    leadId: payload.leadId,
    metadata: { recipientCount: adminEmails.length, recipients: adminEmails }
  })
}
