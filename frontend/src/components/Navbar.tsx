import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Navbar.css'

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM3 4h2l1.6 10.59A2 2 0 0 0 8.6 17H17a2 2 0 0 0 1.95-1.57L21 7H6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Navbar() {
  const { pathname } = useLocation()
  const { itemCount } = useCart()
  const [scrolled, setScrolled] = useState(false)

  const isHome = pathname === '/'
  const solid = !isHome || scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`ola-nav ${solid ? 'ola-nav--scrolled' : ''}`}>
      <div className="ola-nav__bar">
        <div className="ola-nav__brand-col">
          <Link
            to="/"
            className="ola-nav__logo"
            aria-label="Blue Coast Burrito home"
          >
            <span className="ola-nav__logo-mark" aria-hidden />
            <span className="ola-nav__logo-block">
              <span className="ola-nav__logo-text">Blue Coast Burrito</span>
              <span className="ola-nav__location">Mt Juliet, TN</span>
            </span>
          </Link>
        </div>

        <nav className="ola-nav__links" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `ola-nav__link ${isActive ? 'ola-nav__link--active' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `ola-nav__link ${isActive ? 'ola-nav__link--active' : ''}`
            }
          >
            Menu
          </NavLink>
        </nav>

        <div className="ola-nav__actions">
          <Link
            to="/cart"
            className="ola-nav__cart"
            aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ', empty'}`}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="ola-nav__cart-badge" aria-live="polite">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
