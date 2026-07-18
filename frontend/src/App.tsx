import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Menu from './pages/Menu'
import Tables from './pages/Tables'
import PublicMenu from './pages/PublicMenu'
import OrderStatus from './pages/OrderStatus'
import { Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/menu/:restaurantId/:tableId" element={<PublicMenu />} />
        <Route path="/order/:orderId" element={<OrderStatus />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App