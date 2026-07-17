import { Router } from 'express'
import { getPublicMenu, createOrder } from '../controllers/publicController'

const router = Router()

router.get('/menu/:restaurantId/:tableId', getPublicMenu)
router.post('/orders', createOrder)

export default router