import express from 'express'
import { zohoTokenManager } from '../services/zohoTokenManager'
import { pushLeadToZoho } from '../services/zoho'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = express.Router()

// Test token status
router.get('/token-status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const status = zohoTokenManager.getTokenStatus()
    res.json({
      success: true,
      data: status
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Test token validity
router.get('/test-token', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const isValid = await zohoTokenManager.testTokenValidity()
    res.json({
      success: true,
      data: { isValid }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Force token refresh
router.post('/refresh-token', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const newToken = await zohoTokenManager.forceRefreshToken()
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { 
        tokenPreview: newToken.substring(0, 20) + '...',
        status: zohoTokenManager.getTokenStatus()
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Test lead push to Zoho CRM
router.post('/test-lead-push', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testLead = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      message: 'This is a test lead from KirtiBuildWell system'
    }

    await pushLeadToZoho(testLead)
    
    res.json({
      success: true,
      message: 'Test lead successfully pushed to Zoho CRM',
      data: { lead: testLead }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router
