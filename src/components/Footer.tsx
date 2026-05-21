import { Link } from 'react-router'

const shopLinks = [
  { label: 'Road Legal Plates', to: '/product' },
  { label: 'Showplates', to: '/product' },
  { label: '4D Gel Plates', to: '/product' },
  { label: 'Plate Holders', to: '/plate-holders' },
  { label: 'Keyrings', to: '/keyrings' },
  { label: 'Side Badges', to: '/product' },
]

const infoLinks = [
  { label: 'DVLA Guide', to: '/legal' },
  { label: 'Compliance Docs', to: '/legal' },
  { label: 'FAQs', to: '/legal' },
  { label: 'Delivery', to: '/legal' },
]

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Google Reviews', href: 'https://maps.app.goo.gl/P5FN5jQfMAKv4tgy7' },
  { label: 'Write a Review', href: 'https://search.google.com/local/writereview?placeid=ChIJZaCmAKCbcEgRw_NK6nFc0pc' },
  { label: 'Privacy', to: '/legal' },
]

export default function Footer() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768

  return (
    <footer style={{ backgroundColor: '#111111', padding: isMobile ? '60px 0 40px' : '100px 0 60px' }}>
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* 4-Column Grid */}
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gap: '24px',
          }}
        >
          {/* Col 1: Logo + tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/logo.png" alt="PNP" style={{ width: isMobile ? '32px' : '36px', height: isMobile ? '32px' : '36px', borderRadius: '50%', flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: isMobile ? '0.9rem' : '1.1rem',
                  letterSpacing: isMobile ? '0.5px' : '-0.5px',
                  color: '#f2f3f4',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                PUNJABI NUMBER PLATES
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: '#757575',
                maxWidth: '280px',
              }}
            >
              Premium number plate specialists. Same day service on all products.
            </p>
          </div>

          {/* Col 2: Shop */}
          <div>
            <h4
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                color: '#757575',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              SHOP
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '1rem',
                      color: '#757575',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#757575')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Information */}
          <div>
            <h4
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                color: '#757575',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              INFORMATION
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {infoLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '1rem',
                      color: '#757575',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#757575')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <h4
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                color: '#757575',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              COMPANY
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  {'href' in link ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '1rem',
                        color: '#757575',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#757575')}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '1rem',
                        color: '#757575',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#757575')}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            marginTop: '60px',
            paddingTop: '24px',
            borderTop: '1px solid #222222',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Payment Icons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <PaymentIcon label="Apple Pay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17.72 9.73c-.04-1.54.63-2.71 1.98-3.57-.76-1.09-1.9-1.69-3.4-1.8-1.42-.11-2.99.84-3.56.84-.59 0-1.96-.8-3.09-.8C6.32 4.47 3.6 6.6 3.6 9.95c0 1 .19 2.03.56 3.07.5 1.45 2.33 5.02 4.23 4.96 1.01-.02 1.72-.72 3.03-.72 1.29 0 1.96.72 3.09.69 1.28-.02 2.14-1.15 2.92-2.3.92-1.34 1.3-2.64 1.32-2.71-.03-.01-2.54-.97-2.56-3.86-.01-1.76 1.52-2.61 1.56-2.65zM14.88 3.5c.72-.87 1.2-2.08 1.07-3.28-1.04.04-2.29.69-3.04 1.56-.66.76-1.24 1.98-1.09 3.15 1.15.09 2.33-.58 3.06-1.43z" fill="#757575"/>
              </svg>
            </PaymentIcon>
            <PaymentIcon label="Google Pay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" fill="#757575" opacity="0.2"/>
                <text x="5" y="16" fill="#757575" fontSize="9" fontWeight="600">G</text>
                <text x="13" y="16" fill="#757575" fontSize="7">Pay</text>
              </svg>
            </PaymentIcon>
            <PaymentIcon label="Klarna">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#757575" opacity="0.2"/>
                <text x="5" y="16" fill="#757575" fontSize="8" fontWeight="700">K</text>
              </svg>
            </PaymentIcon>
            <PaymentIcon label="Visa">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="3" fill="#757575" opacity="0.15"/>
                <text x="3" y="16" fill="#757575" fontSize="8" fontWeight="700" fontStyle="italic">VISA</text>
              </svg>
            </PaymentIcon>
          </div>

          {/* Copyright */}
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.875rem',
              color: '#757575',
            }}
          >
            PUNJABI NUMBER PLATES 2025
          </p>
        </div>
      </div>
    </footer>
  )
}

function PaymentIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      title={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        transition: 'opacity 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
    >
      {children}
    </div>
  )
}
