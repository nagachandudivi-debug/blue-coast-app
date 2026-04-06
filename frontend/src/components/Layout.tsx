import { Outlet, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Navbar } from './Navbar'
import './Layout.css'

export function Layout() {
  const { pathname } = useLocation()
  const { cartToast } = useCart()
  const isHome = pathname === '/'

  return (
    <div className="app">
      <Navbar />
      <main className={isHome ? 'page-main page-main--home' : 'page-main'}>
        <div className="page-main__outlet" key={pathname}>
          <Outlet />
        </div>
      </main>
      {cartToast && (
        <div className="cart-toast" role="status" aria-live="polite">
          {cartToast}
        </div>
      )}
    </div>
  )
}
