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

/* ═══ GB BADGE ═══ */
function GBBadge() {
  return (
    <svg width="34" height="72" viewBox="0 0 34 72" style={{ display: 'block', flexShrink: 0 }}>
      <defs><clipPath id="bc"><rect x="1" y="1" width="32" height="70" rx="3"/></clipPath></defs>
      <rect x="1" y="1" width="32" height="70" rx="3" fill="#003399" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      <g clipPath="url(#bc)" opacity="0.55">
        <rect x="1" y="1" width="32" height="70" fill="#003399"/>
        <polygon points="1,1 16,18 14,20 1,5" fill="#fff"/>
        <polygon points="33,1 18,18 20,20 33,5" fill="#fff"/>
        <polygon points="1,71 16,54 14,52 1,67" fill="#fff"/>
        <polygon points="33,71 18,54 20,52 33,67" fill="#fff"/>
        <rect x="14" y="1" width="6" height="70" fill="#fff"/>
        <rect x="1" y="33" width="32" height="6" fill="#fff"/>
        <rect x="16" y="1" width="2" height="70" fill="#C8102E"/>
        <rect x="1" y="35" width="32" height="2" fill="#C8102E"/>
        <polygon points="1,1 13,15 11,17 1,6" fill="#C8102E"/>
        <polygon points="33,1 21,15 23,17 33,6" fill="#C8102E"/>
        <polygon points="1,71 13,57 11,55 1,66" fill="#C8102E"/>
        <polygon points="33,71 21,57 23,55 33,66" fill="#C8102E"/>
      </g>
      <text x="17" y="64" textAnchor="middle" fill="#fff" fontFamily="Arial,Helvetica,sans-serif" fontWeight="bold" fontSize="8" letterSpacing="0.5">GB</text>
    </svg>
  )
}

/* ═══ MAIN COMPONENT ═══ */
export default function PlatePreview({ registration, plateStyle = '4d-5mm', showToggle = true }: PlatePreviewProps) {
  const [isRear, setIsRear] = useState(true)

  const rawText = (registration || 'YOUR REG').toUpperCase()
  const cleanText = rawText.replace(/[^A-Z0-9\s]/g, '').trim() || 'YOUR REG'
  const charCount = cleanText.replace(/\s/g, '').length

  const fontSize = charCount <= 4 ? '4.2rem' : charCount <= 6 ? '3.4rem' : charCount <= 8 ? '2.7rem' : '2.1rem'

  const rearBg = '#facc15'
  const frontBg = '#f5f5f5'
  const bg = isRear ? rearBg : frontBg
  const si = styleConfig[plateStyle]

  // 4D raised text shadow
  const getTextShadow = () => {
    if (plateStyle === 'ghost') return 'none'
    const layers: string[] = []
    for (let i = 1; i <= 6; i++) {
      layers.push(`0 ${i}px 0 rgba(0,0,0,${(0.32 - i * 0.04).toFixed(2)})`)
    }
    layers.push('0 6px 8px rgba(0,0,0,0.12)')
    layers.push('0 10px 20px rgba(0,0,0,0.06)')
    return layers.join(', ')
  }

  const textColor = plateStyle === 'ghost'
    ? (isRear ? 'rgba(30,30,30,0.4)' : 'rgba(30,30,30,0.35)')
    : '#1a1a1a'

  return (
    <div style={{ width: '100%' }}>
      {/* 3D Perspective Wrapper */}
      <div style={{ perspective: '1200px', perspectiveOrigin: '50% 50%', padding: '20px 0' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', transform: 'rotateX(4deg)', transformStyle: 'preserve-3d' }}>
          {/* Plate body */}
          <div style={{
            position: 'relative', backgroundColor: bg, borderRadius: '6px',
            padding: 'clamp(6px, 1.4vw, 10px)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset, 0 -1px 0 rgba(0,0,0,0.08) inset, 0 2px 4px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.10), 0 16px 40px rgba(0,0,0,0.06)',
            transition: 'background-color 0.35s ease',
          }}>
            {/* Plate thickness / bevel */}
            <div style={{
              position: 'absolute', left: '6px', right: '6px', bottom: '-4px', height: '4px',
              background: isRear ? 'linear-gradient(to bottom, #e5b814, #d4a812)' : 'linear-gradient(to bottom, #e0e0e0, #cccccc)',
              borderRadius: '0 0 4px 4px', zIndex: -1,
            }} />

            {/* Inner border */}
            <div style={{
              position: 'absolute', inset: '4px',
              border: plateStyle === 'ghost' ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(0,0,0,0.14)',
              borderRadius: '3px', pointerEvents: 'none', zIndex: 1,
            }} />

            {/* Content */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 12px)', position: 'relative', zIndex: 2 }}>
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}><GBBadge /></div>
              <div style={{ width: '1px', height: '58px', backgroundColor: plateStyle === 'ghost' ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.13)', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '58px', overflow: 'hidden', padding: '0 4px' }}>
                <span style={{
                  fontFamily: "Impact, 'Arial Black', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif",
                  fontWeight: 900, fontSize, letterSpacing: '0.06em', lineHeight: 1,
                  color: textColor, whiteSpace: 'nowrap', textTransform: 'uppercase',
                  textShadow: getTextShadow(), fontStretch: 'condensed',
                }}>{cleanText}</span>
              </div>
            </div>

            {/* BSAU145e */}
            <div style={{ position: 'absolute', bottom: '5px', right: '8px', zIndex: 3 }}>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 'clamp(3px, 0.7vw, 5px)', color: plateStyle === 'ghost' ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.22)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>BSAU145e</span>
            </div>
            {/* PNP */}
            <div style={{ position: 'absolute', bottom: '5px', left: '44px', zIndex: 3 }}>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 'clamp(3px, 0.6vw, 4px)', color: plateStyle === 'ghost' ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.16)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>PNP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {showToggle && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em', color: '#757575', textTransform: 'uppercase' }}>{si.label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 700, color: '#ffd700' }}>&pound;{si.price}</span>
          </div>
          <div style={{ display: 'flex', backgroundColor: '#1a1a1a', borderRadius: '9999px', padding: '3px', gap: '2px' }}>
            <button onClick={() => setIsRear(false)} style={{ padding: '5px 14px', borderRadius: '9999px', border: 'none', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: !isRear ? '#f5f5f5' : 'transparent', color: !isRear ? '#050401' : '#757575', fontWeight: 700, textTransform: 'uppercase' }}>Front</button>
            <button onClick={() => setIsRear(true)} style={{ padding: '5px 14px', borderRadius: '9999px', border: 'none', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: isRear ? '#ffd700' : 'transparent', color: isRear ? '#050401' : '#757575', fontWeight: 700, textTransform: 'uppercase' }}>Rear</button>
          </div>
        </div>
      )}
    </div>
  )
}
