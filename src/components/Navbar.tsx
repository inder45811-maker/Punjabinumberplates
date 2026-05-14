import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'
import Marquee from 'react-fast-marquee'

const navLinks = [
  { label: 'HOME', to: '/' },
  { label: 'SHOP', to: '/product' },
  { label: 'GALLERY', to: '/gallery' },
  { label: 'ABOUT', to: '/about' },
  { label: 'CONTACT', to: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '64px',
          zIndex: 1000,
          backgroundColor: scrolled ? 'rgba(5, 4, 1, 0.95)' : '#050401',
          borderBottom: '1px solid #222222',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 24px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <img src="/logo.png" alt="PNP" style={{ width: isMobile ? '32px' : '36px', height: isMobile ? '32px' : '36px', borderRadius: '50%', flexShrink: 0 }} />
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: isMobile ? '0.85rem' : '1.1rem',
                letterSpacing: isMobile ? '0.5px' : '-0.5px',
                color: '#f2f3f4',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              PUNJABI NUMBER PLATES
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div
            className="hidden md:flex"
            style={{
              alignItems: 'center',
              gap: '32px',
            }}
          >
            {navLinks.map((link) => (
              <NavLink key={link.label} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Utility Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              aria-label="Search"
              className="hidden md:block"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: '#f2f3f4',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#f2f3f4')}
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Account"
              className="hidden md:block"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: '#f2f3f4',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#f2f3f4')}
            >
              <User size={20} strokeWidth={1.5} />
            </button>
            <Link
              to="/checkout"
              style={{
                position: 'relative',
                color: '#f2f3f4',
                transition: 'color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#f2f3f4')}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ffd700',
                  borderRadius: '50%',
                  display: 'block',
                }}
              />
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden"
              aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#f2f3f4',
                padding: '4px',
              }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Announcement Ticker */}
      <div
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          width: '100%',
          height: '40px',
          backgroundColor: '#111111',
          borderBottom: '1px solid #222222',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Marquee
          speed={40}
          gradient={false}
          style={{ overflow: 'hidden' }}
        >
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              color: '#757575',
              paddingRight: '48px',
            }}
          >
            FOLLOW US ON INSTAGRAM @PUNJABINUMBERPLATES — IN-STORE PICKUP AVAILABLE — ALL PREMIUM CATEGORIES WITH HIGH DISCOUNTS — FOLLOW US ON INSTAGRAM @PUNJABINUMBERPLATES — IN-STORE PICKUP AVAILABLE — ALL PREMIUM CATEGORIES WITH HIGH DISCOUNTS —
          </span>
        </Marquee>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(17, 17, 17, 0.98)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            backdropFilter: 'blur(20px)',
          }}
        >
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: '#f2f3f4',
              cursor: 'pointer',
            }}
          >
            <X size={28} />
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '1.5rem',
                color: '#f2f3f4',
                textDecoration: 'none',
                letterSpacing: '-0.72px',
                textTransform: 'uppercase',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 400,
        fontSize: '1rem',
        letterSpacing: '-0.24px',
        color: '#f2f3f4',
        textDecoration: 'none',
        textTransform: 'uppercase',
        paddingBottom: '4px',
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: hovered ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
          width: '100%',
          height: '1px',
          backgroundColor: '#ffd700',
          transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      />
    </Link>
  )
}
