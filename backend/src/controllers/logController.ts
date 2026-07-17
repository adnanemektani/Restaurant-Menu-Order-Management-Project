import { Request, Response } from 'express'
import ActivityLog from '../models/ActivityLog'
import pool from '../config/db'

export const getLogs = async (req: any, res: Response) => {
  try {
    const restaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    const restaurantId = restaurant.rows[0].id
    const logs = await ActivityLog.find({ user_id: restaurantId })
      .sort({ created_at: -1 })
      .limit(50)
    res.json(logs)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}