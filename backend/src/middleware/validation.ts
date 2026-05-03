import { Request, Response, NextFunction } from 'express'

// Validation schemas
export const validationSchemas = {
  lead: {
    name: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 80,
      trim: true
    },
    email: {
      required: true,
      type: 'string',
      pattern: /^\S+@\S+\.\S+$/,
      trim: true,
      lowercase: true
    },
    phone: {
      required: true,
      type: 'string',
      minLength: 7,
      maxLength: 20,
      trim: true
    },
    message: {
      required: true,
      type: 'string',
      minLength: 10,
      maxLength: 2000,
      trim: true
    },
    propertyId: {
      required: false,
      type: 'string',
      pattern: /^[0-9a-fA-F]{24}$/
    }
  },
  
  project: {
    title: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 150,
      trim: true
    },
    location: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 200,
      trim: true
    },
    price: {
      required: true,
      type: 'number',
      min: 0
    },
    description: {
      required: true,
      type: 'string',
      minLength: 20,
      maxLength: 5000,
      trim: true
    },
    images: {
      required: false,
      type: 'array',
      itemType: 'string',
      pattern: /^https?:\/\//
    },
    amenities: {
      required: false,
      type: 'array',
      itemType: 'string'
    }
  },

  user: {
    name: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 80,
      trim: true
    },
    email: {
      required: true,
      type: 'string',
      pattern: /^\S+@\S+\.\S+$/,
      trim: true,
      lowercase: true
    },
    password: {
      required: true,
      type: 'string',
      minLength: 6
    },
    role: {
      required: false,
      type: 'string',
      enum: ['admin', 'agent']
    }
  },

  leadStatus: {
    status: {
      required: true,
      type: 'string',
      enum: ['new', 'contacted', 'closed']
    }
  }
}

// Validation function
function validateField(value: any, schema: any): { isValid: boolean; error?: string } {
  // Required check
  if (schema.required && (value === undefined || value === null || value === '')) {
    return { isValid: false, error: `${schema.fieldName || 'Field'} is required` }
  }

  // If not required and value is empty, skip validation
  if (!schema.required && (value === undefined || value === null || value === '')) {
    return { isValid: true }
  }

  // Type check
  if (schema.type === 'string' && typeof value !== 'string') {
    return { isValid: false, error: `${schema.fieldName || 'Field'} must be a string` }
  }
  if (schema.type === 'number' && typeof value !== 'number') {
    return { isValid: false, error: `${schema.fieldName || 'Field'} must be a number` }
  }
  if (schema.type === 'array' && !Array.isArray(value)) {
    return { isValid: false, error: `${schema.fieldName || 'Field'} must be an array` }
  }

  // String-specific validations
  if (schema.type === 'string') {
    // Trim
    if (schema.trim && typeof value === 'string') {
      value = value.trim()
    }

    // Lowercase
    if (schema.lowercase && typeof value === 'string') {
      value = value.toLowerCase()
    }

    // Min length
    if (schema.minLength && value.length < schema.minLength) {
      return { 
        isValid: false, 
        error: `${schema.fieldName || 'Field'} must be at least ${schema.minLength} characters` 
      }
    }

    // Max length
    if (schema.maxLength && value.length > schema.maxLength) {
      return { 
        isValid: false, 
        error: `${schema.fieldName || 'Field'} must be at most ${schema.maxLength} characters` 
      }
    }

    // Pattern
    if (schema.pattern && !schema.pattern.test(value)) {
      return { isValid: false, error: `${schema.fieldName || 'Field'} format is invalid` }
    }
  }

  // Number-specific validations
  if (schema.type === 'number') {
    if (schema.min !== undefined && value < schema.min) {
      return { 
        isValid: false, 
        error: `${schema.fieldName || 'Field'} must be greater than or equal to ${schema.min}` 
      }
    }
    if (schema.max !== undefined && value > schema.max) {
      return { 
        isValid: false, 
        error: `${schema.fieldName || 'Field'} must be less than or equal to ${schema.max}` 
      }
    }
  }

  // Array-specific validations
  if (schema.type === 'array') {
    // Validate each item if itemType is specified
    if (schema.itemType) {
      for (let i = 0; i < value.length; i++) {
        const item = value[i]
        if (schema.itemType === 'string' && typeof item !== 'string') {
          return { 
            isValid: false, 
            error: `All items in ${schema.fieldName || 'Field'} must be strings` 
          }
        }
        if (schema.pattern && typeof item === 'string' && !schema.pattern.test(item)) {
          return { 
            isValid: false, 
            error: `Item ${i + 1} in ${schema.fieldName || 'Field'} has invalid format` 
          }
        }
      }
    }
  }

  // Enum validation
  if (schema.enum && !schema.enum.includes(value)) {
    return { 
      isValid: false, 
      error: `${schema.fieldName || 'Field'} must be one of: ${schema.enum.join(', ')}` 
    }
  }

  return { isValid: true }
}

// Validation middleware factory
export function validateBody(schemaName: keyof typeof validationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = validationSchemas[schemaName]
    const errors: string[] = []

    // Add field names to schema for error messages
    const schemaWithNames = Object.entries(schema).reduce((acc, [key, rules]) => {
      acc[key] = { ...rules, fieldName: key.charAt(0).toUpperCase() + key.slice(1) }
      return acc
    }, {} as any)

    // Validate each field
    for (const [fieldName, rules] of Object.entries(schemaWithNames)) {
      const result = validateField(req.body[fieldName], rules)
      if (!result.isValid && result.error) {
        errors.push(result.error)
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      })
    }

    next()
  }
}

// Sanitization middleware
export function sanitizeBody(req: Request, res: Response, next: NextFunction) {
  // Check if this is a legitimate authentication endpoint
  const authEndpoints = ['/api/auth/login', '/api/auth/register']
  const isAuthEndpoint = authEndpoints.some(endpoint => req.originalUrl.startsWith(endpoint))
  
  // Remove any potentially dangerous fields (except for auth endpoints)
  const dangerousFields = ['password', 'token', 'secret', 'key', 'auth']
  
  for (const field of dangerousFields) {
    if (req.body[field]) {
      // Only log as suspicious if not on auth endpoints
      if (!isAuthEndpoint) {
        console.warn(`Potentially dangerous field detected in request body: ${field} on endpoint: ${req.originalUrl}`)
      }
    }
  }

  // Remove any script tags from string fields
  function sanitizeString(value: any): any {
    if (typeof value === 'string') {
      return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeString)
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {}
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeString(val)
      }
      return sanitized
    }
    return value
  }

  req.body = sanitizeString(req.body)
  next()
}

// Rate limiting middleware (simple in-memory implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(options: { windowMs: number; max: number; message?: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip + (req.headers['user-agent'] || '')
    const now = Date.now()
    const windowStart = now - options.windowMs

    // Clean up old entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (data.resetTime < now) {
        rateLimitStore.delete(ip)
      }
    }

    // Get or create rate limit data
    let rateLimitData = rateLimitStore.get(key)
    if (!rateLimitData || rateLimitData.resetTime < now) {
      rateLimitData = { count: 0, resetTime: now + options.windowMs }
      rateLimitStore.set(key, rateLimitData)
    }

    // Increment count
    rateLimitData.count++

    // Check if limit exceeded
    if (rateLimitData.count > options.max) {
      return res.status(429).json({
        success: false,
        error: options.message || 'Too many requests, please try again later',
        retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000)
      })
    }

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': options.max.toString(),
      'X-RateLimit-Remaining': Math.max(0, options.max - rateLimitData.count).toString(),
      'X-RateLimit-Reset': new Date(rateLimitData.resetTime).toISOString()
    })

    next()
  }
}
