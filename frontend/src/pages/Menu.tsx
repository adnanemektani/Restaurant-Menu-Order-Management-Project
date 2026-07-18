import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

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

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [newItem, setNewItem] = useState({
    name: '', description: '', price: '', category_id: '', image_url: ''
  })
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const navigate = useNavigate()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const [cats, itms] = await Promise.all([
      api.get('/menu/categories'),
      api.get('/menu/items'),
    ])
    setCategories(cats.data)
    setItems(itms.data)
  }

  const createCategory = async () => {
    if (!newCategory) return
    await api.post('/menu/categories', { name: newCategory })
    setNewCategory('')
    fetchData()
  }

  const createItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.category_id) return
    await api.post('/menu/items', {
      ...newItem,
      price: parseFloat(newItem.price),
      category_id: parseInt(newItem.category_id),
    })
    setNewItem({ name: '', description: '', price: '', category_id: '', image_url: '' })
    fetchData()
  }

  const saveEdit = async () => {
    if (!editItem) return
    await api.put(`/menu/items/${editItem.id}`, editItem)
    setEditItem(null)
    fetchData()
  }

  const toggleAvailable = async (item: MenuItem) => {
    await api.put(`/menu/items/${item.id}`, { ...item, available: !item.available })
    fetchData()
  }

  const deleteItem = async (id: number) => {
    await api.delete(`/menu/items/${id}`)
    fetchData()
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5ede0' }}>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4 flex justify-between items-center shadow-md"
        style={{ backgroundColor: '#3b1f0f' }}>
        <h1 className="text-2xl font-bold text-amber-100"
          style={{ fontFamily: 'Playfair Display, serif' }}>
          Menu Builder
        </h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="text-sm font-semibold px-5 py-2 rounded-lg border border-amber-200 text-amber-100 hover:bg-amber-900 transition-all">
             Dashboard
          </button>
          <button onClick={logout}
            className="text-sm font-semibold px-5 py-2 rounded-lg border border-amber-200 text-amber-100 hover:bg-amber-900 transition-all">
            Logout
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-8 flex-1">

        {/* Add Category */}
        <div className="bg-white/40 border border-stone-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-stone-800 mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Add Category
          </h2>
          <div className="flex gap-3">
            <input value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name (e.g. Burgers)"
              className="flex-1 border border-stone-400 rounded-xl px-4 py-2 bg-white/50 text-stone-800 focus:outline-none focus:border-stone-800"
            />
            <button onClick={createCategory}
              className="px-6 py-2 rounded-xl font-semibold text-amber-100"
              style={{ backgroundColor: '#3b1f0f' }}>
              Add
            </button>
          </div>
        </div>

        {/* Add Item */}
        <div className="bg-white/40 border border-stone-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-stone-800 mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Add Menu Item
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item name"
              className="border border-stone-400 rounded-xl px-4 py-2 bg-white/50 text-stone-800 focus:outline-none focus:border-stone-800"
            />
            <input value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              placeholder="Price (DH)" type="number"
              className="border border-stone-400 rounded-xl px-4 py-2 bg-white/50 text-stone-800 focus:outline-none focus:border-stone-800"
            />
            <input value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Description"
              className="border border-stone-400 rounded-xl px-4 py-2 bg-white/50 text-stone-800 focus:outline-none focus:border-stone-800"
            />
            <select value={newItem.category_id}
              onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
              className="border border-stone-400 rounded-xl px-4 py-2 bg-white/50 text-stone-800 focus:outline-none focus:border-stone-800"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input value={newItem.image_url}
              onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
              placeholder="Image URL (optional)"
              className="border border-stone-400 rounded-xl px-4 py-2 bg-white/50 text-stone-800 focus:outline-none focus:border-stone-800 md:col-span-2"
            />
          </div>
          {newItem.image_url && (
            <img src={newItem.image_url} alt="preview"
              className="w-24 h-24 object-cover rounded-xl mb-3 border border-stone-300" />
          )}
          <button onClick={createItem}
            className="px-6 py-2 rounded-xl font-semibold text-amber-100"
            style={{ backgroundColor: '#3b1f0f' }}>
            Add Item
          </button>
        </div>

        {/* Edit Modal */}
        {editItem && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
              <h2 className="text-xl font-bold text-stone-800 mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}>
                Edit Item
              </h2>
              <div className="space-y-3">
                <input value={editItem.name}
                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  className="w-full border border-stone-400 rounded-xl px-4 py-2 focus:outline-none"
                  placeholder="Name"
                />
                <input value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  className="w-full border border-stone-400 rounded-xl px-4 py-2 focus:outline-none"
                  placeholder="Description"
                />
                <input value={editItem.price}
                  onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
                  type="number"
                  className="w-full border border-stone-400 rounded-xl px-4 py-2 focus:outline-none"
                  placeholder="Price"
                />
                <input value={editItem.image_url}
                  onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value })}
                  className="w-full border border-stone-400 rounded-xl px-4 py-2 focus:outline-none"
                  placeholder="Image URL"
                />
                {editItem.image_url && (
                  <img src={editItem.image_url} alt="preview"
                    className="w-24 h-24 object-cover rounded-xl border border-stone-300" />
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={saveEdit}
                  className="flex-1 py-2 rounded-xl font-semibold text-amber-100"
                  style={{ backgroundColor: '#3b1f0f' }}>
                  Save
                </button>
                <button onClick={() => setEditItem(null)}
                  className="flex-1 py-2 rounded-xl font-semibold border border-stone-400 text-stone-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items List by Category */}
        {categories.map(cat => (
          <div key={cat.id} className="bg-white/40 border border-stone-800 rounded-2xl p-6 mb-4">
            <h2 className="text-xl font-bold text-stone-800 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              {cat.name}
            </h2>
            <div className="space-y-3">
              {items.filter(i => i.category_id === cat.id).map(item => (
                <div key={item.id}
                  className="flex justify-between items-center bg-white/50 border border-stone-300 rounded-xl px-4 py-3">
                  <div className="flex gap-4 items-center">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl border border-stone-300" />
                    )}
                    <div>
                      <p className="font-bold text-stone-800">{item.name}</p>
                      <p className="text-stone-500 text-sm">{item.description}</p>
                      <p className="text-amber-800 font-semibold">{item.price} DH</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button onClick={() => setEditItem(item)}
                      className="text-xs px-3 py-1 rounded-lg border border-stone-500 text-stone-600 hover:bg-stone-600 hover:text-white transition-all">
                      Edit
                    </button>
                    <button onClick={() => toggleAvailable(item)}
                      className={`text-xs px-3 py-1 rounded-lg border transition-all ${item.available
                        ? 'border-green-700 text-green-700 hover:bg-green-700 hover:text-white'
                        : 'border-red-700 text-red-700 hover:bg-red-700 hover:text-white'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                    <button onClick={() => deleteItem(item.id)}
                      className="text-xs px-3 py-1 rounded-lg border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {items.filter(i => i.category_id === cat.id).length === 0 && (
                <p className="text-stone-400 text-sm text-center py-2">No items yet</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-2 text-center text-stone-400 text-xs border-t border-stone-300"
        style={{ backgroundColor: '#f5ede0' }}>
        Crafted with care for your restaurant — <span className="text-stone-600 font-medium">Adnane Mektani</span>
      </footer>

    </div>
  )
}