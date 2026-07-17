import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user_id: { type: Number, required: true },
  details: { type: Object },
  created_at: { type: Date, default: Date.now }
})

export default mongoose.model('ActivityLog', activityLogSchema)