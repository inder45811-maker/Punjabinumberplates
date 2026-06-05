import { X, Plus, Minus, ShoppingBag, Loader, AlertCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router'

const c = {
  bgVoid: '#050401',
  bgSurface: '#111111',
  textPrimary: '#f2f3f4',
  textMuted: '#757575',
  accentGold: '#ffd700',
  accentGoldGlow: 'rgba(255, 215, 0, 0.15)',
  borderSubtle: '#222222',
  alertRed: '#d9534f',
}

export default function CartDrawer() {
  const { cart, isOpen, isLoading, error, closeCart, removeLine, updateQuantity, clearError } = useCart()

  if (!isOpen) return null

  const lines = cart?.lines.nodes ?? []
  const totalQuantity = cart?.totalQuantity ?? 0
  const subtotal = cart?.cost.subtotalAmount.amount ?? '0.00'
  const currency = cart?.cost.subtotalAmount.currencyCode ?? 'GBP'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 2000,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '420px',
          height: '100vh',
          backgroundColor: c.bgSurface,
          borderLeft: `1px solid ${c.borderSubtle}`,
          zIndex: 2001,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: `1px solid ${c.borderSubtle}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color={c.accentGold} />
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                color: c.textPrimary,
                textTransform: 'uppercase',
                letterSpacing: '-0.24px',
              }}
            >
              Your Bag
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                color: c.textMuted,
                backgroundColor: c.bgVoid,
                padding: '2px 8px',
                borderRadius: '9999px',
              }}
            >
              {totalQuantity}
            </span>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: c.textMuted,
              padding: '4px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = c.accentGold)}
            onMouseLeave={(e) => (e.currentTarget.style.color = c.textMuted)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              margin: '16px 24px 0',
              padding: '12px 16px',
              backgroundColor: 'rgba(217, 83, 79, 0.1)',
              border: `1px solid ${c.alertRed}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: c.alertRed,
              fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={16} />
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={clearError}
              style={{
                background: 'none',
                border: 'none',
                color: c.alertRed,
                cursor: 'pointer',
                fontSize: '0.75rem',
                textDecoration: 'underline',
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {lines.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                color: c.textMuted,
              }}
            >
              <ShoppingBag size={48} strokeWidth={1} />
              <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>
                Your bag is empty.
                <br />
                <Link
                  to="/categories/number-plates"
                  onClick={closeCart}
                  style={{ color: c.accentGold, textDecoration: 'none', fontWeight: 600 }}
                >
                  Start shopping
                </Link>
              </p>
            </div>
          ) : (
            lines.map((line) => (
              <div
                key={line.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: c.bgVoid,
                  border: `1px solid ${c.borderSubtle}`,
                  borderRadius: '8px',
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: c.bgSurface,
                  }}
                >
                  {line.merchandise.product.featuredImage ? (
                    <img
                      src={line.merchandise.product.featuredImage.url}
                      alt={line.merchandise.product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: c.textMuted,
                        fontSize: '0.75rem',
                      }}
                    >
                      PNP
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: c.textPrimary,
                      textTransform: 'uppercase',
                      marginBottom: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {line.merchandise.product.title}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: c.textMuted, marginBottom: '6px' }}>
                    {line.merchandise.title}
                  </p>

                  {/* Custom attributes */}
                  {line.attributes.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                      {line.attributes.map((attr) => (
                        <span
                          key={attr.key}
                          style={{
                            fontSize: '0.65rem',
                            color: c.textMuted,
                            backgroundColor: c.bgSurface,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: `1px solid ${c.borderSubtle}`,
                          }}
                        >
                          {attr.value}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quantity + Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        disabled={isLoading}
                        style={{
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: c.bgSurface,
                          border: `1px solid ${c.borderSubtle}`,
                          borderRadius: '4px',
                          color: c.textPrimary,
                          cursor: 'pointer',
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.875rem',
                          color: c.textPrimary,
                          minWidth: '24px',
                          textAlign: 'center',
                        }}
                      >
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        disabled={isLoading}
                        style={{
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: c.bgSurface,
                          border: `1px solid ${c.borderSubtle}`,
                          borderRadius: '4px',
                          color: c.textPrimary,
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem', color: c.accentGold }}>
                      £{parseFloat(line.cost.totalAmount.amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeLine(line.id)}
                  disabled={isLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: c.textMuted,
                    padding: '4px',
                    alignSelf: 'flex-start',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = c.alertRed)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = c.textMuted)}
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: `1px solid ${c.borderSubtle}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: c.textMuted }}>Subtotal</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.125rem', color: c.accentGold, fontWeight: 700 }}>
                £{parseFloat(subtotal).toFixed(2)} {currency}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: c.textMuted, margin: 0 }}>
              Shipping & taxes calculated at checkout.
            </p>
            <Link
              to="/checkout"
              onClick={closeCart}
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                backgroundColor: c.accentGold,
                color: c.bgVoid,
                textAlign: 'center',
                textDecoration: 'none',
                borderRadius: '9999px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.24px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 0 40px ${c.accentGoldGlow}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </span>
              ) : (
                'Checkout'
              )}
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
