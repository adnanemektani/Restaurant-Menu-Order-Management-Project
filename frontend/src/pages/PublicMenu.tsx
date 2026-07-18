import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

interface Category {
  id: number
  name: string
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  available: boolean
  category_id: number
  image_url: string
}

interface CartItem {
  menu_item_id: number
  name: string
  price: number
  quantity: number
}

export default function PublicMenu() {
  const { restaurantId, tableId } = useParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [ordered, setOrdered] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/public/menu/${restaurantId}/${tableId}`)
      .then(res => {
        setCategories(res.data.categories)
        setItems(res.data.items)
      })
  }, [])

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.menu_item_id === item.id)
      if (existing) {
        return prev.map(c => c.menu_item_id === item.id
          ? { ...c, quantity: c.quantity + 1 } : c)
      }
      return [...prev, { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev
      .map(c => c.menu_item_id === id ? { ...c, quantity: c.quantity - 1 } : c)
      .filter(c => c.quantity > 0)
    )
  }

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0).toFixed(2)

  const placeOrder = async () => {
    await axios.post('http://localhost:5000/api/public/orders', {
      restaurant_id: parseInt(restaurantId!),
      table_number: parseInt(tableId!),
      items: cart.map(c => ({
        menu_item_id: c.menu_item_id,
        quantity: c.quantity,
        price: c.price
      }))
    })
    setOrdered(true)
    setCart([])
  }

  if (ordered) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5ede0' }}>
      <div className="text-center">
        <p className="text-6xl mb-4">🍽️</p>
        <h1 className="text-3xl font-bold text-stone-800 mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          Order Placed!
        </h1>
        <p className="text-stone-500">Your order is being prepared</p>
        <button onClick={() => setOrdered(false)}
          className="mt-6 px-6 py-2 rounded-xl text-amber-100 font-semibold"
          style={{ backgroundColor: '#3b1f0f' }}>
          Order More
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pb-40" style={{ backgroundColor: '#f5ede0' }}>

      {/* Header */}
      <div className="py-8 text-center shadow-sm" style={{ backgroundColor: '#3b1f0f' }}>
        <h1 className="text-3xl font-bold text-amber-100"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          Our Menu
        </h1>
        <p className="text-amber-300 text-sm mt-1">Table {tableId}</p>
      </div>

      {/* Menu Items */}
      <div className="px-4 pt-6">
        {categories.map(cat => (
          <div key={cat.id} className="mb-6">
            <h2 className="text-xl font-bold text-stone-800 mb-3 px-2"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              {cat.name}
            </h2>
            <div className="space-y-3">
              {items.filter(i => i.category_id === cat.id).map(item => (
                <div key={item.id}
                  className="bg-white/60 border border-stone-300 rounded-2xl p-4 flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl border border-stone-200" />
                    )}
                    <div>
                      <p className="font-bold text-stone-800">{item.name}</p>
                      <p className="text-stone-500 text-sm">{item.description}</p>
                      <p className="text-amber-800 font-semibold">{item.price} DH</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cart.find(c => c.menu_item_id === item.id) ? (
                      <>
                        <button onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-full border border-stone-400 text-stone-600 font-bold hover:bg-stone-200">
                          −
                        </button>
                        <span className="font-bold text-stone-800 w-4 text-center">
                          {cart.find(c => c.menu_item_id === item.id)?.quantity}
                        </span>
                        <button onClick={() => addToCart(item)}
                          className="w-8 h-8 rounded-full text-amber-100 font-bold"
                          style={{ backgroundColor: '#3b1f0f' }}>
                          +
                        </button>
                      </>
                    ) : (
                      <button onClick={() => addToCart(item)}
                        className="px-4 py-2 rounded-xl text-amber-100 text-sm font-semibold"
                        style={{ backgroundColor: '#3b1f0f' }}>
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Fixed Bottom */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 shadow-2xl border-t border-stone-300"
          style={{ backgroundColor: '#f5ede0' }}>
          <div className="max-w-lg mx-auto">
            <div className="mb-3 space-y-1">
              {cart.map(c => (
                <div key={c.menu_item_id} className="flex justify-between text-sm text-stone-700">
                  <span>{c.name} x{c.quantity}</span>
                  <span>{(c.price * c.quantity).toFixed(2)} DH</span>
                </div>
              ))}
            </div>
            <button onClick={placeOrder}
              className="w-full py-3 rounded-xl font-bold text-amber-100 text-lg"
              style={{ backgroundColor: '#3b1f0f' }}>
              Order — {total} DH
            </button>
          </div>
        </div>
      )}
    </div>
  )
}