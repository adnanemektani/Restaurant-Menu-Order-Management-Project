import { Request, Response } from 'express'
import pool from '../config/db'
import QRCode from 'qrcode'

export const createTable = async (req: any, res: Response) => {
  try {
    const { table_number } = req.body
    const restaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    const restaurantId = restaurant.rows[0].id

    const menuUrl = `${process.env.FRONTEND_URL}/menu/${restaurantId}/${table_number}`
    const qrCodeUrl = await QRCode.toDataURL(menuUrl)

    const result = await pool.query(
      'INSERT INTO tables (table_number, restaurant_id, qr_code_url) VALUES ($1, $2, $3) RETURNING *',
      [table_number, restaurantId, qrCodeUrl]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getTables = async (req: any, res: Response) => {
  try {
    const restaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    const restaurantId = restaurant.rows[0].id
    const result = await pool.query(
      'SELECT * FROM tables WHERE restaurant_id = $1 ORDER BY table_number',
      [restaurantId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteTable = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM tables WHERE id = $1', [id])
    res.json({ message: 'Table deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}