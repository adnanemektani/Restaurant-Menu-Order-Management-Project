import { Router } from 'express'
import { getLogs } from '../controllers/logController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

router.get('/', authMiddleware, getLogs)

export default router