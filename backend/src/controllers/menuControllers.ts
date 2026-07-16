import { Request, Response } from 'express'
import pool from '../config/db'

// Categories
export const createCategory = async (req: any, res: Response) => {
  try {
    const { name } = req.body
    const restaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    const restaurantId = restaurant.rows[0].id
    const result = await pool.query(
      'INSERT INTO categories (name, restaurant_id) VALUES ($1, $2) RETURNING *',
      [name, restaurantId]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getCategories = async (req: any, res: Response) => {
  try {
    const restaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    const restaurantId = restaurant.rows[0].id
    const result = await pool.query(
      'SELECT * FROM categories WHERE restaurant_id = $1 ORDER BY position',
      [restaurantId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Menu Items
export const createMenuItem = async (req: any, res: Response) => {
  try {
    const { name, description, price, category_id, image_url } = req.body
    const restaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    const restaurantId = restaurant.rows[0].id
    const result = await pool.query(
      'INSERT INTO menu_items (name, description, price, category_id, restaurant_id, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, category_id, restaurantId, image_url]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getMenuItems = async (req: any, res: Response) => {
  try {
    const restaurant = await pool.query(
      'SELECT id FROM restaurants WHERE owner_id = $1',
      [req.user.id]
    )
    const restaurantId = restaurant.rows[0].id
    const result = await pool.query(
      'SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY position',
      [restaurantId]
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateMenuItem = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, price, available, image_url } = req.body
    const result = await pool.query(
      'UPDATE menu_items SET name=$1, description=$2, price=$3, available=$4, image_url=$5 WHERE id=$6 RETURNING *',
      [name, description, price, available, image_url, id]
    )
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteMenuItem = async (req: any, res: Response) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM menu_items WHERE id=$1', [id])
    res.json({ message: 'Item deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}