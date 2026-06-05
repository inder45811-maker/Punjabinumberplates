import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink } from 'react-router'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { categories } from '../lib/catalog'
import { useCart } from '../context/CartContext'

const primaryLinks = [
  { label: 'Home', to: '/' },
  ...categories.map((category) => ({
    label: category.shortLabel,
    to: `/categories/${category.slug}`,
  })),
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { openCart, cart } = useCart()
  const cartCount = cart?.totalQuantity ?? 0

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="announcement-bar">In-store pickup available | Road legal and show plate options</div>
      <nav className="site-nav" aria-label="Primary navigation">
        <div className="site-nav__brand">
          <button
            type="button"
            className="icon-button category-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open category menu"
            aria-expanded={menuOpen}
          >
            <Menu size={24} aria-hidden="true" />
          </button>
          <Link to="/" className="site-logo" onClick={() => setMenuOpen(false)}>
            <img src="/logo.webp" alt="Punjabi Number Plates" width="42" height="42" />
            <span>Punjabi Number Plates</span>
          </Link>
        </div>

        <div className="site-nav__links">
          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="site-nav__actions">
          <button type="button" className="icon-button" onClick={openCart} aria-label="Open cart">
            <ShoppingBag size={22} aria-hidden="true" />
            {cartCount > 0 && <span>{cartCount > 9 ? '9+' : cartCount}</span>}
          </button>
        </div>
      </nav>

      {menuOpen &&
        createPortal(
          <div className="category-menu" role="dialog" aria-modal="true" aria-label="Shop categories">
          <button
            type="button"
            className="category-menu__backdrop"
            onClick={() => setMenuOpen(false)}
            aria-label="Close category menu"
          />
          <button
            type="button"
            className="icon-button category-menu__close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} aria-hidden="true" />
          </button>
          <div className="category-menu__sheet">
            <div className="category-menu__header">
              <p>Shop menu</p>
              <h2>All categories</h2>
            </div>
            <div className="category-menu__grid">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/categories/${category.slug}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{category.label}</span>
                  <small>{category.description}</small>
                </Link>
              ))}
            </div>
            <div className="category-menu__footer">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </div>
        </div>,
          document.body
        )}
    </header>
  )
}
