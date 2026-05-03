import { Request, Response, NextFunction } from 'express'

function isValidEmail(value: string): boolean {
  return /^\S+@\S+\.\S+$/.test(value)
}

export function validateLeadInput(req: Request, res: Response, next: NextFunction) {
  const { name, email, phone, message } = req.body ?? {}

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Name must be at least 2 characters' })
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
    return res.status(400).json({ success: false, error: 'Valid email is required' })
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    return res.status(400).json({ success: false, error: 'Phone must be at least 7 characters' })
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({ success: false, error: 'Message must be at least 10 characters' })
  }

  return next()
}
