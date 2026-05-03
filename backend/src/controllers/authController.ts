import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'change-me'

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body
  if (!email || !password) return res.status(400).json({ message: 'email and password required' })
  if (!name) return res.status(400).json({ message: 'name is required' })
  if (role && !['admin', 'agent'].includes(role)) {
    return res.status(400).json({ message: 'invalid role' })
  }
  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ message: 'user already exists' })
  const hash = await bcrypt.hash(password, 10)
  const user = new User({ name, email, password: hash, role: role || 'agent' })
  await user.save()
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'email and password required' })
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'invalid credentials' })
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } })
}
