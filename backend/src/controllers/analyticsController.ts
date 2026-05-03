import { Request, Response, NextFunction } from 'express'
import { Lead } from '../models/Lead'
import { Project } from '../models/Project'
import { User } from '../models/User'
import { Activity } from '../models/Activity'
import { AuthRequest } from '../middleware/auth'

export async function getDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      closedLeads,
      totalProjects,
      totalUsers,
      recentLeads,
      recentActivities
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ status: 'contacted' }),
      Lead.countDocuments({ status: 'closed' }),
      Project.countDocuments(),
      User.countDocuments(),
      Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
      Activity.find().sort({ createdAt: -1 }).limit(10).lean()
    ])

    // Calculate lead conversion rates
    const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : '0'

    return res.status(200).json({
      success: true,
      data: {
        leads: {
          total: totalLeads,
          new: newLeads,
          contacted: contactedLeads,
          closed: closedLeads,
          conversionRate: parseFloat(conversionRate)
        },
        projects: {
          total: totalProjects
        },
        users: {
          total: totalUsers
        },
        recentLeads,
        recentActivities
      }
    })
  } catch (error) {
    return next(error)
  }
}

export async function getLeadAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate, status } = req.query

    // Build date filter
    const dateFilter: any = {}
    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate as string)
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate as string)
    }

    // Build status filter
    const statusFilter = status ? { status } : {}

    // Combine filters
    const filter = { ...dateFilter, ...statusFilter }

    // Get leads with filters
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean()

    // Calculate statistics
    const totalLeads = leads.length
    const statusBreakdown = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const monthlyTrend = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    return res.status(200).json({
      success: true,
      data: {
        totalLeads,
        statusBreakdown,
        monthlyTrend,
        leads: leads.slice(0, 50) // Limit to 50 for performance
      }
    })
  } catch (error) {
    return next(error)
  }
}

export async function getActivityLog(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20, type, userId, leadId, projectId } = req.query

    const filter: any = {}
    if (type) filter.type = type
    if (userId) filter.userId = userId
    if (leadId) filter.leadId = leadId
    if (projectId) filter.projectId = projectId

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .populate('userId', 'name email')
        .populate('leadId', 'name email')
        .populate('projectId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Activity.countDocuments(filter)
    ])

    return res.status(200).json({
      success: true,
      data: {
        activities,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    })
  } catch (error) {
    return next(error)
  }
}

export async function getProjectStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const projects = await Project.find().lean()
    
    // Calculate statistics
    const totalProjects = projects.length
    const totalValue = projects.reduce((sum, project) => sum + project.price, 0)
    const averagePrice = totalProjects > 0 ? totalValue / totalProjects : 0

    // Price distribution
    const priceRanges = {
      under50L: projects.filter(p => p.price < 5000000).length,
      '50L-1Cr': projects.filter(p => p.price >= 5000000 && p.price < 10000000).length,
      '1Cr-2Cr': projects.filter(p => p.price >= 10000000 && p.price < 20000000).length,
      '2Cr-5Cr': projects.filter(p => p.price >= 20000000 && p.price < 50000000).length,
      above5Cr: projects.filter(p => p.price >= 50000000).length
    }

    // Location distribution
    const locationStats = projects.reduce((acc, project) => {
      const location = project.location.toLowerCase()
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalValue,
        averagePrice,
        priceRanges,
        locationStats,
        projects: projects.slice(0, 20) // Limit for performance
      }
    })
  } catch (error) {
    return next(error)
  }
}
