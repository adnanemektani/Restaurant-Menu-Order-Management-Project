import { Router } from 'express'
import { createTable, getTables, deleteTable } from '../controllers/tableController'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

router.post('/', authMiddleware, createTable)
router.get('/', authMiddleware, getTables)
router.delete('/:id', authMiddleware, deleteTable)

export default router