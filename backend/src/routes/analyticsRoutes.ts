import { Router } from 'express'
import { getTopItems, getRevenue, getPeakHours } from '../controllers/analyticsController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

router.get('/top-items', authMiddleware, getTopItems)
router.get('/revenue', authMiddleware, getRevenue)
router.get('/peak-hours', authMiddleware, getPeakHours)

export default router