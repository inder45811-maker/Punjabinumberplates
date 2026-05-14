import { useState } from 'react'

export type PlateStyle = '4d-5mm' | '4d-gel' | '3d-gel' | 'ghost'

interface PlatePreviewProps {
  registration: string
  plateStyle?: PlateStyle
  showToggle?: boolean
}

export const styleConfig: Record<PlateStyle, { label: string; price: number; desc: string }> = {
  '4d-5mm': { label: '4D 5MM', price: 45, desc: 'Laser-cut acrylic' },
  '4d-gel':  { label: '4D GEL', price: 55, desc: 'Gloss gel resin' },
  '3d-gel':  { label: '3D GEL', price: 35, desc: 'Domed resin' },
  'ghost':   { label: 'GHOST',  price: 70, desc: 'Stealth subtle' },
}

/* ═══ GB BADGE — post-Brexit UK ═══ */
function GBBadge() {
  return (
    <svg width="40" height="84" viewBox="0 0 40 84" style={{ display: 'block', flexShrink: 0 }}>
      <defs><clipPath id="bc"><rect x="1" y="1" width="38" height="82" rx="4"/></clipPath></defs>
      <rect x="1" y="1" width="38" height="82" rx="4" fill="#0D47A1" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      <g clipPath="url(#bc)" opacity="0.55">
        <rect x="1" y="1" width="38" height="82" fill="#0D47A1"/>
        <polygon points="1,1 18,20.5 16,22.5 1,6" fill="#fff"/>
        <polygon points="39,1 22,20.5 24,22.5 39,6" fill="#fff"/>
        <polygon points="1,83 18,63.5 16,61.5 1,78" fill="#fff"/>
        <polygon points="39,83 22,63.5 24,61.5 39,78" fill="#fff"/>
        <rect x="17" y="1" width="6" height="82" fill="#fff"/>
        <rect x="1" y="39" width="38" height="6" fill="#fff"/>
        <rect x="19" y="1" width="2" height="82" fill="#C8102E"/>
        <rect x="1" y="41" width="38" height="2" fill="#C8102E"/>
        <polygon points="1,1 15,17 13,19 1,7" fill="#C8102E"/>
        <polygon points="39,1 25,17 27,19 39,7" fill="#C8102E"/>
        <polygon points="1,83 15,67 13,65 1,77" fill="#C8102E"/>
        <polygon points="39,83 25,67 27,65 39,77" fill="#C8102E"/>
      </g>
      <text x="20" y="77" textAnchor="middle" fill="#fff" fontFamily="Arial,Helvetica,sans-serif" fontWeight="bold" fontSize="9" letterSpacing="0.5">GB</text>
    </svg>
  )
}

/* ═══ CHARLES WRIGHT STYLE TEXT ═══ */
function PlateText({ text, plateStyle, isRear }: { text: string; plateStyle: PlateStyle; isRear: boolean }) {
  const clean = text.toUpperCase().replace(/[^A-Z0-9\s]/g, '').trim() || 'YOUR REG'
  const count = clean.replace(/\s/g, '').length
  const fontSize = count <= 4 ? '3.8rem' : count <= 6 ? '3.0rem' : count <= 8 ? '2.4rem' : '1.9rem'

  let color = '#1a1a1a'
  if (plateStyle === 'ghost') {
    color = isRear ? 'rgba(25,25,25,0.42)' : 'rgba(25,25,25,0.38)'
  }

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 0, overflow: 'hidden', padding: '0 4px',
    }}>
      <span style={{
        fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', 'Arial Black', sans-serif",
        fontWeight: 900, fontSize, letterSpacing: '0.04em', lineHeight: 1,
        color, whiteSpace: 'nowrap', textTransform: 'uppercase', fontStretch: 'condensed',
      }}>{clean}</span>
    </div>
  )
}

/* ═══ MAIN COMPONENT ═══ */
export default function PlatePreview({ registration, plateStyle = '4d-5mm', showToggle = true }: PlatePreviewProps) {
  const [isRear, setIsRear] = useState(true)
  const bg = isRear ? '#facc15' : '#f5f5f5'
  const si = styleConfig[plateStyle]

  return (
    <div style={{ width: '100%' }}>
      {/* Plate body */}
      <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{
          position: 'relative', backgroundColor: bg, borderRadius: '6px',
          padding: 'clamp(5px, 1.2vw, 9px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.10), 0 4px 14px rgba(0,0,0,0.08), 0 8px 28px rgba(0,0,0,0.04)',
          transition: 'background-color 0.35s ease',
        }}>
          {/* Inner border */}
          <div style={{
            position: 'absolute', inset: '3px',
            border: plateStyle === 'ghost' ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(0,0,0,0.12)',
            borderRadius: '3px', pointerEvents: 'none', zIndex: 1,
          }} />

          {/* Content */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'clamp(5px, 1.2vw, 10px)',
            position: 'relative', zIndex: 2,
          }}>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <GBBadge />
            </div>
            <div style={{
              width: '1px', height: '66px',
              backgroundColor: plateStyle === 'ghost' ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.13)',
              flexShrink: 0,
            }} />
            <PlateText text={registration} plateStyle={plateStyle} isRear={isRear} />
          </div>

          {/* BSAU145e */}
          <div style={{ position: 'absolute', bottom: '5px', right: '8px', zIndex: 3 }}>
            <span style={{
              fontFamily: 'Arial, sans-serif', fontSize: 'clamp(3px, 0.7vw, 5px)',
              color: plateStyle === 'ghost' ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.22)',
              letterSpacing: '0.02em', textTransform: 'uppercase',
            }}>BSAU145e</span>
          </div>
          {/* PNP */}
          <div style={{ position: 'absolute', bottom: '5px', left: '48px', zIndex: 3 }}>
            <span style={{
              fontFamily: 'Arial, sans-serif', fontSize: 'clamp(3px, 0.6vw, 4px)',
              color: plateStyle === 'ghost' ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.16)',
              letterSpacing: '0.02em', textTransform: 'uppercase',
            }}>PNP</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      {showToggle && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '12px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem',
              letterSpacing: '0.12em', color: '#757575', textTransform: 'uppercase',
            }}>{si.label}</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem',
              fontWeight: 700, color: '#ffd700',
            }}>&pound;{si.price}</span>
          </div>
          <div style={{ display: 'flex', backgroundColor: '#1a1a1a', borderRadius: '9999px', padding: '3px', gap: '2px' }}>
            <button onClick={() => setIsRear(false)} style={{
              padding: '5px 14px', borderRadius: '9999px', border: 'none',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em',
              cursor: 'pointer', transition: 'all 0.2s ease',
              backgroundColor: !isRear ? '#f5f5f5' : 'transparent',
              color: !isRear ? '#050401' : '#757575', fontWeight: 700, textTransform: 'uppercase',
            }}>Front</button>
            <button onClick={() => setIsRear(true)} style={{
              padding: '5px 14px', borderRadius: '9999px', border: 'none',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em',
              cursor: 'pointer', transition: 'all 0.2s ease',
              backgroundColor: isRear ? '#ffd700' : 'transparent',
              color: isRear ? '#050401' : '#757575', fontWeight: 700, textTransform: 'uppercase',
            }}>Rear</button>
          </div>
        </div>
      )}
    </div>
  )
}
