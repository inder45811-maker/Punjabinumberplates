import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'

const WHATSAPP_NUMBER = '447700900000' // ← UPDATE THIS WITH REAL NUMBER
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Punjabi%20Number%20Plates%2C%20I%27m%20interested%20in%20your%20products.`

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // Show popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Chat Popup */}
      {showPopup && !isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
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
            onClick={() => setShowPopup(false)}
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
            👋 Need help with your order?
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
            <MessageCircle size={14} />
            Chat on WhatsApp
          </a>
        </div>
      )}

      {/* Floating Chat Button */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
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
        <MessageCircle size={28} color="#fff" fill="#fff" />
      </a>

      {/* Pulse animation ring */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
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
