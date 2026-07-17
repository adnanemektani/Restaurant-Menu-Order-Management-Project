import { Request, Response } from 'express'
import pool from '../config/db'

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

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}