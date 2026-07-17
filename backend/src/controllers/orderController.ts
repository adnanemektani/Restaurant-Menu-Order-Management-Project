import { Request, Response } from 'express'
import pool from '../config/db'
import { io } from '../index'
import ActivityLog from '../models/ActivityLog'

export const getOrders = async (req: any, res: Response) => {
    try {
        const restaurant = await pool.query(
            'SELECT id FROM restaurants WHERE owner_id = $1',
            [req.user.id]
        )
        const restaurantId = restaurant.rows[0].id
        const result = await pool.query(
            'SELECT * FROM orders WHERE restaurant_id = $1 ORDER BY created_at DESC',
            [restaurantId]
        )
        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

export const updateOrderStatus = async (req: any, res: Response) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        )
        const order = result.rows[0]
        io.emit('orderUpdated', order)
        await ActivityLog.create({
            action: 'order_status_updated',
            user_id: req.user.id,
            details: { order_id: id, new_status: status }
        })
        res.json(order)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}