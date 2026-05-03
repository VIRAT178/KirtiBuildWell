import express from 'express'
import { getDashboardStats, getLeadAnalytics, getActivityLog, getProjectStats } from '../controllers/analyticsController'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = express.Router()

// All analytics routes require admin access
router.use(authenticateToken, requireAdmin)

router.get('/dashboard', getDashboardStats)
router.get('/leads', getLeadAnalytics)
router.get('/activities', getActivityLog)
router.get('/projects', getProjectStats)

export default router
