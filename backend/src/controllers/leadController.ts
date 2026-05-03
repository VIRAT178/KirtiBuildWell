import { Request, Response, NextFunction } from 'express'
import { pushLeadToZoho } from '../services/zoho'
import { sendLeadConfirmationEmail, sendAdminNotificationEmail } from '../services/mailer'
import { Lead } from '../models/Lead'
import { Project } from '../models/Project'
import { Activity } from '../models/Activity'

const allowedStatuses = ['new', 'contacted', 'closed'] as const
type LeadStatus = (typeof allowedStatuses)[number]

export async function createLead(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, message, propertyId } = req.body
    const warnings: string[] = []

    // Get project title if propertyId is provided
    let propertyTitle = undefined
    if (propertyId) {
      const project = await Project.findById(propertyId).lean()
      propertyTitle = project?.title
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      propertyId,
      source: 'website',
      status: 'new'
    })

    // Log lead creation activity
    await Activity.create({
      type: 'lead_created',
      description: `New lead created: ${lead.name}`,
      leadId: lead._id,
      projectId: propertyId,
      metadata: { 
        leadName: lead.name, 
        leadEmail: lead.email, 
        leadPhone: lead.phone,
        propertyTitle 
      }
    })

    // Zoho CRM integration
    try {
      await pushLeadToZoho({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim()
      })
      
      // Log successful CRM sync
      await Activity.create({
        type: 'crm_sync',
        description: `Lead synced to Zoho CRM: ${lead.name}`,
        leadId: lead._id,
        status: 'success'
      })
    } catch (error) {
      // Non-blocking integration failure: lead is already persisted.
      console.warn('Zoho push failed', error)
      warnings.push('CRM sync failed')
      
      // Log failed CRM sync
      await Activity.create({
        type: 'crm_sync',
        description: `CRM sync failed for lead: ${lead.name}`,
        leadId: lead._id,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Send confirmation email to lead
    try {
      await sendLeadConfirmationEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim(),
        propertyTitle
      })
      lead.confirmationEmailSentAt = new Date()
      await lead.save()
      
      // Log email sent
      await Activity.create({
        type: 'email_sent',
        description: `Confirmation email sent to lead: ${lead.name}`,
        leadId: lead._id,
        status: 'success'
      })
    } catch (error) {
      // Non-blocking email failure: lead is already persisted.
      console.warn('Confirmation email failed', error)
      warnings.push('Confirmation email failed')
      
      // Log failed email
      await Activity.create({
        type: 'email_sent',
        description: `Confirmation email failed for lead: ${lead.name}`,
        leadId: lead._id,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Send admin notification email
    try {
      await sendAdminNotificationEmail({
        leadName: name.trim(),
        leadEmail: email.trim().toLowerCase(),
        leadPhone: phone.trim(),
        leadMessage: message.trim(),
        propertyTitle,
        leadId: lead._id.toString()
      })
    } catch (error) {
      // Non-blocking admin notification failure
      console.warn('Admin notification email failed', error)
      warnings.push('Admin notification failed')
      
      // Log failed admin notification
      await Activity.create({
        type: 'email_sent',
        description: `Admin notification failed for lead: ${lead.name}`,
        leadId: lead._id,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    return res.status(201).json({
      success: true,
      message: 'Lead submitted successfully',
      data: {
        id: lead._id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        source: lead.source,
        createdAt: lead.createdAt
      },
      warnings: warnings.length > 0 ? warnings : undefined
    })
  } catch (error) {
    return next(error)
  }
}

export async function getLeads(req: Request, res: Response, next: NextFunction) {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined
    const query = status ? { status } : {}

    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean()

    return res.status(200).json({
      success: true,
      data: leads
    })
  } catch (error) {
    return next(error)
  }
}

export async function updateLeadStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const { status } = req.body as { status?: LeadStatus }

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Allowed values: new, contacted, closed'
      })
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found'
      })
    }

    // Log lead update activity
    await Activity.create({
      type: 'lead_updated',
      description: `Lead status updated to ${status}: ${lead.name}`,
      leadId: lead._id,
      metadata: { oldStatus: 'unknown', newStatus: status }
    })

    return res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: lead
    })
  } catch (error) {
    return next(error)
  }
}
