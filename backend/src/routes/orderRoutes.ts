import { Router } from 'express'
import { getOrders, updateOrderStatus } from '../controllers/orderController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authMiddleware, getOrders)
router.patch('/:id', authMiddleware, updateOrderStatus)

export default router