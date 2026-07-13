import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/db'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password and restaurant name are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain uppercase and lowercase letters' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userResult = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    )

    const user = userResult.rows[0]

    const restaurantResult = await pool.query(
      'INSERT INTO restaurants (name, owner_id) VALUES ($1, $2) RETURNING id, name',
      [name, user.id]
    )

    res.status(201).json({
      message: 'User and restaurant created',
      user: user,
      restaurant: restaurantResult.rows[0]
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const user = result.rows[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}