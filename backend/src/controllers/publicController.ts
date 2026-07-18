import { Request, Response } from 'express'
import pool from '../config/db'
import { io } from '../index'
import ActivityLog from '../models/ActivityLog'

export const getPublicMenu = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params

    const categories = await pool.query(
      'SELECT * FROM categories WHERE restaurant_id = $1 ORDER BY position',
      [restaurantId]
    )

    const items = await pool.query(
      'SELECT * FROM menu_items WHERE restaurant_id = $1 AND available = true ORDER BY position',
      [restaurantId]
    )

    res.json({
      categories: categories.rows,
      items: items.rows
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { restaurant_id, table_number, items } = req.body

    const total = items.reduce((sum: number, item: any) =>
      sum + (item.price * item.quantity), 0
    )

    const orderResult = await pool.query(
      'INSERT INTO orders (restaurant_id, table_number, total) VALUES ($1, $2, $3) RETURNING *',
      [restaurant_id, table_number, total]
    )

    const order = orderResult.rows[0]

    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.menu_item_id, item.quantity, item.price]
      )
    }

    io.emit('newOrder', order)
    await ActivityLog.create({
      action: 'new_order',
      user_id: Number(restaurant_id),
      details: { order_id: order.id, table_number, total }
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
export const getOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params
    const result = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}