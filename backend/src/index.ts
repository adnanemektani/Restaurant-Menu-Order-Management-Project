import express from 'express'
import mongoose from 'mongoose'
import {Pool} from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())

import authRoutes from './routes/authRoutes'
app.use('/api/auth', authRoutes)
import menuRoutes from './routes/menuRoutes'
app.use('/api/menu', menuRoutes)
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Server is running!')
})

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant-saas')
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'restaurant_saas',
})
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((error: unknown) => console.error('PostgreSQL connection error:', error))

export { app, pool }