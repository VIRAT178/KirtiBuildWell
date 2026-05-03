import express from 'express'
import { createLead, getLeads, updateLeadStatus } from '../controllers/leadController'
import { validateBody } from '../middleware/validation'
import { rateLimit } from '../middleware/validation'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = express.Router()

// Public route (rate limited for lead submissions)
router.post('/', rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: 'Too many lead submissions, please try again later' }), validateBody('lead'), createLead)

// Admin-only routes
router.get('/', authenticateToken, requireAdmin, getLeads)
router.patch('/:id/status', authenticateToken, requireAdmin, validateBody('leadStatus'), updateLeadStatus)

export default router
