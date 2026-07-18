import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

interface Table {
  id: number
  table_number: number
  restaurant_id: number
  qr_code_url: string
}

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([])
  const [tableNumber, setTableNumber] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchTables() }, [])

  const fetchTables = async () => {
    const res = await api.get('/tables')
    setTables(res.data)
  }

  const createTable = async () => {
    if (!tableNumber) return
    await api.post('/tables', { table_number: parseInt(tableNumber) })
    setTableNumber('')
    fetchTables()
  }

  const deleteTable = async (id: number) => {
    await api.delete(`/tables/${id}`)
    fetchTables()
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
          Tables & QR Codes
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

        {/* Add Table */}
        <div className="bg-white/40 border border-stone-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-stone-800 mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}>
            Add Table
          </h2>
          <div className="flex gap-3">
            <input
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Table number (e.g. 5)"
              type="number"
              className="flex-1 border border-stone-400 rounded-xl px-4 py-2 bg-white/50 text-stone-800 focus:outline-none focus:border-stone-800"
            />
            <button onClick={createTable}
              className="px-6 py-2 rounded-xl font-semibold text-amber-100"
              style={{ backgroundColor: '#3b1f0f' }}>
              Add
            </button>
          </div>
        </div>
        {/* Print All QR */}
{tables.length > 0 && (
  <div className="flex justify-end mb-4">
    <button
      onClick={() => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) return
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Codes - Restaurant</title>
              <style>
                body { font-family: serif; background: #f5ede0; padding: 20px; }
                .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                .card { border: 2px solid #3b1f0f; border-radius: 16px; padding: 20px; text-align: center; background: white; }
                .card h2 { font-size: 20px; margin-bottom: 10px; color: #3b1f0f; }
                .card img { width: 150px; height: 150px; }
                @media print { body { background: white; } }
              </style>
            </head>
            <body>
              <h1 style="text-align:center; color:#3b1f0f; margin-bottom:30px;">Restaurant QR Codes</h1>
              <div class="grid">
                ${tables.map(t => `
                  <div class="card">
                    <h2>Table ${t.table_number}</h2>
                    <img src="${t.qr_code_url}" />
                  </div>
                `).join('')}
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }}
      className="px-6 py-2 rounded-xl font-semibold text-amber-100 transition-all"
      style={{ backgroundColor: '#3b1f0f' }}>
       Print All QR Codes
    </button>
  </div>
)}

        {/* Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map(table => (
            <div key={table.id}
              className="bg-white/40 border border-stone-800 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-bold text-stone-800 mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}>
                Table {table.table_number}
              </h2>
              {table.qr_code_url && (
                <img src={table.qr_code_url} alt={`QR Table ${table.table_number}`}
                  className="w-40 h-40 mx-auto mb-4 rounded-xl border border-stone-300" />
              )}
              <div className="flex gap-2 justify-center">
                <a href={table.qr_code_url} download={`table-${table.table_number}-qr.png`}
                  className="text-sm px-4 py-2 rounded-lg font-semibold text-amber-100 transition-all"
                  style={{ backgroundColor: '#3b1f0f' }}>
                  Download QR
                </a>
                <button onClick={() => deleteTable(table.id)}
                  className="text-sm px-4 py-2 rounded-lg border border-red-400 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-2 text-center text-stone-400 text-xs border-t border-stone-300"
        style={{ backgroundColor: '#f5ede0' }}>
        Crafted with care for your restaurant — <span className="text-stone-600 font-medium">Adnane Mektani</span>
      </footer>

    </div>
  )
}