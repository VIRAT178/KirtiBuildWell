import { Request, Response, NextFunction } from 'express'
import { Activity } from '../models/Activity'

// Custom error classes
export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean
  public details?: any

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    this.details = details
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, details)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409)
  }
}

// Error logging utility
async function logError(error: any, req: Request) {
  try {
    const errorData = {
      type: 'error',
      description: `Server error: ${error.message}`,
      status: 'failed',
      errorMessage: error.message,
      metadata: {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        statusCode: error.statusCode || 500,
        stack: error.stack,
        body: req.method !== 'GET' ? JSON.stringify(req.body).substring(0, 500) : undefined,
        query: Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : undefined
      }
    }

    await Activity.create(errorData)
  } catch (logError) {
    console.error('Failed to log error to database:', logError)
  }
}

// Main error handler middleware
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log the error
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    timestamp: new Date().toISOString()
  })

  // Log to database (non-blocking)
  logError(err, req).catch(() => {
    // Ignore logging errors
  })

  // Default error values
  let statusCode = 500
  let message = 'Internal Server Error'
  let details: any = undefined
  let isOperational = false

  // Handle different error types
  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
    details = err.details
    isOperational = err.isOperational
  } else if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400
    message = 'Validation failed'
    details = Object.values(err.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message
    }))
    isOperational = true
  } else if (err.name === 'CastError') {
    // Mongoose cast error (invalid ObjectId)
    statusCode = 400
    message = 'Invalid ID format'
    isOperational = true
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409
    message = 'Resource already exists'
    details = {
      field: Object.keys(err.keyPattern || {})[0],
      value: Object.values(err.keyValue || {})[0]
    }
    isOperational = true
  } else if (err.name === 'JsonWebTokenError') {
    // JWT error
    statusCode = 401
    message = 'Invalid authentication token'
    isOperational = true
  } else if (err.name === 'TokenExpiredError') {
    // JWT expired error
    statusCode = 401
    message = 'Authentication token expired'
    isOperational = true
  } else if (err.message) {
    // Generic error with message
    statusCode = err.statusCode || 500
    message = err.message
    isOperational = err.statusCode !== undefined
  }

  // Build error response
  const errorResponse: any = {
    success: false,
    error: message
  }

  // Add details in development or for operational errors
  if (process.env.NODE_ENV === 'development' || isOperational) {
    if (details) {
      errorResponse.details = details
    }
    if (process.env.NODE_ENV === 'development' && err.stack) {
      errorResponse.stack = err.stack
    }
  }

  // Add request ID if available
  if (req.headers['x-request-id']) {
    errorResponse.requestId = req.headers['x-request-id']
  }

  res.status(statusCode).json(errorResponse)
}

// Async error wrapper
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// 404 handler
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new NotFoundError(`Route ${req.method} ${req.originalUrl}`)
  next(error)
}
