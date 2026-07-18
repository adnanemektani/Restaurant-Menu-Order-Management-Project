import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import axios from 'axios'

const socket = io('http://localhost:5000')

interface Order {
  id: number
  table_number: number
  status: string
  total: string
  created_at: string
}

export default function OrderStatus() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrder()

    socket.on('orderUpdated', (updatedOrder: Order) => {
      if (updatedOrder.id === parseInt(orderId!)) {
        setOrder(updatedOrder)
      }
    })

    return () => { socket.off('orderUpdated') }
  }, [])

  const fetchOrder = async () => {
    const res = await axios.get(`http://localhost:5000/api/public/orders/${orderId}`)
    setOrder(res.data)
  }

  const steps = ['new', 'preparing', 'ready', 'delivered']

  const statusInfo: any = {
    new: { label: 'Order Received', emoji: '📋', desc: 'Your order has been received' },
    preparing: { label: 'Preparing', emoji: '👨‍🍳', desc: 'Kitchen is preparing your order' },
    ready: { label: 'Ready!', emoji: '✅', desc: 'Your order is ready!' },
    delivered: { label: 'Delivered', emoji: '🍽️', desc: 'Enjoy your meal!' },
  }

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5ede0' }}>
      <p className="text-stone-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5ede0' }}>

      {/* Header */}
      <div className="py-8 text-center shadow-sm" style={{ backgroundColor: '#3b1f0f' }}>
        <h1 className="text-3xl font-bold text-amber-100"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          Order #{order.id}
        </h1>
        <p className="text-amber-300 text-sm mt-1">Table {order.table_number}</p>
      </div>

      <div className="px-6 pt-10 max-w-lg mx-auto">

        {/* Status Emoji */}
        <div className="text-center mb-8">
          <p className="text-7xl mb-4">{statusInfo[order.status]?.emoji}</p>
          <h2 className="text-2xl font-bold text-stone-800"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            {statusInfo[order.status]?.label}
          </h2>
          <p className="text-stone-500 mt-1">{statusInfo[order.status]?.desc}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-10">
          {steps.map((step, index) => {
            const currentIndex = steps.indexOf(order.status)
            const isDone = index <= currentIndex
            return (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all ${isDone ? 'text-amber-100' : 'bg-stone-200 text-stone-400'}`}
                  style={isDone ? { backgroundColor: '#3b1f0f' } : {}}>
                  {isDone ? '✓' : index + 1}
                </div>
                <p className={`text-xs text-center ${isDone ? 'text-stone-800 font-semibold' : 'text-stone-400'}`}>
                  {statusInfo[step]?.label}
                </p>
                {index < steps.length - 1 && (
                  <div className={`absolute h-0.5 w-full ${isDone ? 'bg-stone-800' : 'bg-stone-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Order Total */}
        <div className="bg-white/40 border border-stone-800 rounded-2xl p-6 text-center">
          <p className="text-stone-500 text-sm mb-1">Total</p>
          <p className="text-3xl font-bold text-amber-800"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            {order.total} DH
          </p>
        </div>

      </div>
    </div>
  )
}