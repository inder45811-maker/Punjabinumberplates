import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { X } from 'lucide-react'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '447384088600'
const WHATSAPP_MESSAGE = 'Hi the Number Plate Shop, i would like to place an order please \u{1F64F}'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

function WhatsAppIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function WhatsAppChat() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowPopup(true), 5000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 899px)')
    const update = () => setIsMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const isBuilderPath = location.pathname.startsWith('/builder')
  const isCheckoutPath = location.pathname.startsWith('/checkout')
  const floatingBottom = isBuilderPath && isMobile ? '96px' : '24px'
  const popupBottom = isBuilderPath && isMobile ? '162px' : '90px'
  const canShowPopup = showPopup && !isOpen && !isMobile
  const hideFloatingChat = isMobile && (isBuilderPath || isCheckoutPath)

  return (
    <>
      {canShowPopup && (
        <div
          style={{
            position: 'fixed',
            bottom: popupBottom,
            right: '24px',
            zIndex: 999,
            maxWidth: '280px',
            backgroundColor: '#0d0d0d',
            border: '1px solid #1e1e1e',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            animation: 'slideInUp 0.3s ease',
          }}
        >
          <button
            type="button"
            onClick={() => setShowPopup(false)}
            aria-label="Close WhatsApp prompt"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'none',
              border: 'none',
              color: '#757575',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={14} />
          </button>
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.85rem',
              color: '#f2f3f4',
              margin: '0 0 8px 0',
              lineHeight: 1.4,
            }}
          >
            Need help with your order?
          </p>
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.75rem',
              color: '#757575',
              margin: '0 0 12px 0',
            }}
          >
            Message us on WhatsApp for instant support.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#25D366',
              color: '#fff',
              borderRadius: '8px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <WhatsAppIcon size={14} />
            Chat on WhatsApp
          </a>
        </div>
      )}

      {!hideFloatingChat && (
        <>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(true)}
            aria-label="Chat on WhatsApp"
            style={{
              position: 'fixed',
              bottom: floatingBottom,
              right: '24px',
              zIndex: 998,
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(37, 211, 102, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 211, 102, 0.3)'
            }}
          >
            <WhatsAppIcon size={30} />
          </a>

          <div
            style={{
              position: 'fixed',
              bottom: floatingBottom,
              right: '24px',
              zIndex: 997,
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '2px solid #25D366',
              animation: 'pulse-ring 2s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </>
  )
}
