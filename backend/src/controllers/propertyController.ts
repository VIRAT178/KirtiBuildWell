import { Request, Response, NextFunction } from 'express'
import { Project } from '../models/Project'
import { Activity } from '../models/Activity'
import { AuthRequest } from '../middleware/auth'

export async function getProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean()
    return res.status(200).json({
      success: true,
      data: projects
    })
  } catch (error) {
    return next(error)
  }
}

export async function getProjectById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const project = await Project.findById(id).lean()
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }
    
    return res.status(200).json({
      success: true,
      data: project
    })
  } catch (error) {
    return next(error)
  }
}

export async function createProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, location, price, description, images, amenities } = req.body
    
    // Validation
    if (!title) return res.status(400).json({ success: false, error: 'Title is required' })
    if (!location) return res.status(400).json({ success: false, error: 'Location is required' })
    if (price === undefined || price === null) return res.status(400).json({ success: false, error: 'Price is required' })
    if (!description) return res.status(400).json({ success: false, error: 'Description is required' })
    
    const project = new Project({
      title: title.trim(),
      location: location.trim(),
      price: Number(price),
      description: description.trim(),
      images: Array.isArray(images) ? images : [],
      amenities: Array.isArray(amenities) ? amenities : []
    })
    
    await project.save()
    
    // Log activity
    await Activity.create({
      type: 'project_created',
      description: `New project created: ${project.title}`,
      userId: req.user?.id,
      projectId: project._id,
      metadata: { projectTitle: project.title, projectPrice: project.price }
    })
    
    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    })
  } catch (error) {
    return next(error)
  }
}

export async function updateProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const { title, location, price, description, images, amenities } = req.body
    
    const project = await Project.findById(id)
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }
    
    const updateData: any = {}
    if (title !== undefined) updateData.title = title.trim()
    if (location !== undefined) updateData.location = location.trim()
    if (price !== undefined && price !== null) updateData.price = Number(price)
    if (description !== undefined) updateData.description = description.trim()
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : []
    if (amenities !== undefined) updateData.amenities = Array.isArray(amenities) ? amenities : []
    
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    
    // Log activity
    await Activity.create({
      type: 'project_updated',
      description: `Project updated: ${updatedProject?.title}`,
      userId: req.user?.id,
      projectId: project._id,
      metadata: { changes: Object.keys(updateData) }
    })
    
    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    })
  } catch (error) {
    return next(error)
  }
}

export async function deleteProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    
    const project = await Project.findById(id)
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }
    
    await Project.findByIdAndDelete(id)
    
    // Log activity
    await Activity.create({
      type: 'project_updated',
      description: `Project deleted: ${project.title}`,
      userId: req.user?.id,
      projectId: project._id,
      metadata: { deleted: true }
    })
    
    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    return next(error)
  }
}

// Legacy functions for backward compatibility
export async function listProperties(req: Request, res: Response, next?: NextFunction) {
  return getProjects(req, res, next || (() => {}))
}

export async function createProperty(req: Request, res: Response, next?: NextFunction) {
  return createProject(req as AuthRequest, res, next || (() => {}))
}
