import express from 'express'
import { getProjects, getProjectById, createProject, updateProject, deleteProject, listProperties, createProperty } from '../controllers/propertyController'
import { authenticateToken, requireAdmin } from '../middleware/auth'
import { validateBody } from '../middleware/validation'

const router = express.Router()

// Public routes
router.get('/', listProperties)
router.get('/legacy/list', listProperties)
router.get('/:id', getProjectById)

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, validateBody('project'), createProject)
router.put('/:id', authenticateToken, requireAdmin, updateProject)
router.delete('/:id', authenticateToken, requireAdmin, deleteProject)

// Legacy routes for backward compatibility
router.post('/legacy/create', createProperty)

export default router
