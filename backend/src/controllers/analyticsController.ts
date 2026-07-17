import { Request, Response } from 'express'
import pool from '../config/db'

export const getTopItems = async (req: any, res: Response) => {
  try {
    const restaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    const restaurantId = restaurant.rows[0].id

    const result = await pool.query(
      `SELECT mi.name, SUM(oi.quantity) as total_ordered
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.restaurant_id = $1
       GROUP BY mi.name
       ORDER BY total_ordered DESC
       LIMIT 10`,
      [restaurantId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getRevenue = async (req: any, res: Response) => {
  try {
    const restaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    const restaurantId = restaurant.rows[0].id

    const result = await pool.query(
      `SELECT DATE(created_at) as date, SUM(total) as revenue
       FROM orders
       WHERE restaurant_id = $1
       GROUP BY DATE(created_at)
       ORDER BY date DESC
       LIMIT 30`,
      [restaurantId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getPeakHours = async (req: any, res: Response) => {
  try {
    const restaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    const restaurantId = restaurant.rows[0].id

    const result = await pool.query(
      `SELECT EXTRACT(HOUR FROM created_at) as hour, COUNT(*) as total_orders
       FROM orders
       WHERE restaurant_id = $1
       GROUP BY hour
       ORDER BY total_orders DESC`,
      [restaurantId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}