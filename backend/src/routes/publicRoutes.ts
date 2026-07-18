import { Router } from 'express'
import { getPublicMenu, createOrder, getOrderStatus } from '../controllers/publicController'

const router = Router()

router.get('/menu/:restaurantId/:tableId', getPublicMenu)
router.post('/orders', createOrder)
router.get('/orders/:orderId', getOrderStatus)

export default router