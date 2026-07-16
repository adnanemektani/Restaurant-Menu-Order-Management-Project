import { Router } from 'express'
import { createCategory, getCategories, createMenuItem, getMenuItems, updateMenuItem, deleteMenuItem } from '../controllers/menuControllers'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

// Categories
router.post('/categories', authMiddleware, createCategory)
router.get('/categories', authMiddleware, getCategories)

// Menu Items
router.post('/items', authMiddleware, createMenuItem)
router.get('/items', authMiddleware, getMenuItems)
router.put('/items/:id', authMiddleware, updateMenuItem)
router.delete('/items/:id', authMiddleware, deleteMenuItem)

export default router