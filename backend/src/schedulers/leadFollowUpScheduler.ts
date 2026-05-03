import cron from 'node-cron'
import { Lead } from '../models/Lead'
import { sendLeadFollowUpEmail } from '../services/mailer'
import { Activity } from '../models/Activity'

export function startLeadFollowUpScheduler() {
  const cronExp = process.env.LEAD_FOLLOWUP_CRON || '*/10 * * * *'
  const followUpHours = Number(process.env.LEAD_FOLLOWUP_HOURS || 24)

  cron.schedule(cronExp, async () => {
    const cutoff = new Date(Date.now() - followUpHours * 60 * 60 * 1000)

    try {
      const leads = await Lead.find({
        followUpEmailSentAt: { $exists: false },
        status: { $in: ['new', 'contacted'] },
        createdAt: { $lte: cutoff }
      })

      if (leads.length > 0) {
        console.log(`Processing ${leads.length} leads for follow-up emails`)
      }

      for (const lead of leads) {
        try {
          await sendLeadFollowUpEmail({ 
            name: lead.name, 
            email: lead.email,
            phone: lead.phone 
          })
          
          lead.followUpEmailSentAt = new Date()
          await lead.save()
          
          // Log successful follow-up email
          await Activity.create({
            type: 'follow_up_sent',
            description: `Follow-up email sent to lead: ${lead.name}`,
            leadId: lead._id,
            status: 'success',
            metadata: { 
              leadEmail: lead.email,
              followUpHours,
              sentAt: lead.followUpEmailSentAt
            }
          })
          
          console.log(`Follow-up email sent to lead: ${lead.name} (${lead.email})`)
        } catch (error) {
          console.warn(`Follow-up email failed for lead ${lead._id}`, error)
          
          // Log failed follow-up email
          await Activity.create({
            type: 'follow_up_sent',
            description: `Follow-up email failed for lead: ${lead.name}`,
            leadId: lead._id,
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            metadata: { 
              leadEmail: lead.email,
              followUpHours
            }
          })
        }
      }
    } catch (error) {
      console.error('Lead follow-up scheduler failed', error)
      
      // Log scheduler failure
      await Activity.create({
        type: 'follow_up_sent',
        description: 'Follow-up scheduler execution failed',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        metadata: { 
          cronExpression: cronExp,
          followUpHours,
          executedAt: new Date()
        }
      }).catch(logError => {
        console.error('Failed to log scheduler error:', logError)
      })
    }
  })

  console.log(`Lead follow-up scheduler started (cron: ${cronExp}, delay: ${followUpHours}h)`)
}
