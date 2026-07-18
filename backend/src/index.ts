import express from 'express'
import mongoose from 'mongoose'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/authRoutes'
import menuRoutes from './routes/menuRoutes'
import tableRoutes from './routes/tableRoutes'
import publicRoutes from './routes/publicRoutes'
import orderRoutes from './routes/orderRoutes'
import analyticsRoutes from './routes/analyticsRoutes'
import logRoutes from './routes/logRoutes'
import pool from './config/db'
import cors from 'cors'


dotenv.config()

const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server is running!')
})

const httpServer = createServer(app)
export const io = new Server(httpServer, {
  cors: { origin: '*' }
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/tables', tableRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/logs', logRoutes)

const port = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant-saas')
  .then(() => {
    console.log('Connected to MongoDB')
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((error: unknown) => console.error('PostgreSQL connection error:', error))

export { app, pool }