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

/* ═══════════════════════════════════════════════
   GB BADGE — Post-Brexit UK number plate badge
   ═══════════════════════════════════════════════ */
function GBBadge() {
  return (
    <svg
      width="44"
      height="94"
      viewBox="0 0 44 94"
      style={{ flexShrink: 0, height: '85%', alignSelf: 'center' }}
    >
      <rect x="1" y="1" width="42" height="92" rx="4" fill="#003399" stroke="#1a3a7a" strokeWidth="0.5" />
      <g clipPath="url(#badgeClip)" opacity="0.7">
        <rect x="1" y="1" width="42" height="92" fill="#003399" />
        <rect x="1" y="1" width="42" height="46" fill="#fff" opacity="0.15" />
        <rect x="18" y="1" width="8" height="92" fill="#fff" opacity="0.3" />
        <rect x="1" y="40" width="42" height="14" fill="#fff" opacity="0.3" />
        <rect x="1" y="1" width="42" height="92" fill="none" stroke="#fff" strokeWidth="1" opacity="0.2" />
        <rect x="20" y="1" width="4" height="92" fill="#cc0000" opacity="0.4" />
        <rect x="1" y="43" width="42" height="8" fill="#cc0000" opacity="0.4" />
      </g>
      <defs>
        <clipPath id="badgeClip">
          <rect x="1" y="1" width="42" height="92" rx="4" />
        </clipPath>
      </defs>
      <text x="22" y="86" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="10" letterSpacing="0.5">
        GB
      </text>
    </svg>
  )
}

/* ═══════════════════════════════════════════════
   CHARACTER RENDERER — Per-style character styling
   ═══════════════════════════════════════════════ */
function PlateChars({ text, style, isRear }: { text: string; style: PlateStyle; isRear: boolean }) {
  const groups = text.trim().split(/\s+/).filter(Boolean)
  const totalChars = text.replace(/\s/g, '').length
  const baseFontSize = totalChars <= 5 ? 3.8 : totalChars <= 7 ? 3.0 : totalChars <= 9 ? 2.4 : 1.9

  const getCharStyle = (): React.CSSProperties => {
    switch (style) {
      case '4d-5mm':
        return {
          fontFamily: "'Inter', 'Arial Black', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 900,
          fontSize: `${baseFontSize}rem`,
          letterSpacing: '0.08em',
          lineHeight: 1,
          color: '#0a0a0a',
          textShadow: '0 1px 0 rgba(0,0,0,0.15), 0 2px 0 rgba(0,0,0,0.1), 0 3px 2px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.2)',
          WebkitTextStroke: '0.3px rgba(0,0,0,0.08)',
        }
      case '4d-gel':
        return {
          fontFamily: "'Inter', 'Arial Black', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 900,
          fontSize: `${baseFontSize}rem`,
          letterSpacing: '0.08em',
          lineHeight: 1,
          color: '#000',
          textShadow: '0 1px 1px rgba(0,0,0,0.3), 0 2px 3px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.1)',
          WebkitTextStroke: '0.2px rgba(0,0,0,0.05)',
        }
      case '3d-gel':
        return {
          fontFamily: "'Inter', 'Arial Black', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 900,
          fontSize: `${baseFontSize}rem`,
          letterSpacing: '0.08em',
          lineHeight: 1,
          color: '#111',
          textShadow: '0 2px 0 rgba(0,0,0,0.2), 0 3px 4px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
          transform: 'translateY(-1px)',
        }
      case 'ghost':
        return {
          fontFamily: "'Inter', 'Arial Black', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 900,
          fontSize: `${baseFontSize}rem`,
          letterSpacing: '0.08em',
          lineHeight: 1,
          color: isRear ? 'rgba(20,20,20,0.45)' : 'rgba(20,20,20,0.4)',
          textShadow: '0 0 1px rgba(0,0,0,0.05)',
        }
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'clamp(4px, 1vw, 12px)',
      flex: 1,
      overflow: 'hidden',
    }}>
      {groups.map((group, gi) => (
        <span key={gi} style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
          {gi > 0 && <span style={{ display: 'inline-block', width: 'clamp(6px, 1.5vw, 16px)' }} />}
          {group.split('').map((char, ci) => (
            <span key={ci} style={getCharStyle()}>{char}</span>
          ))}
        </span>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN PLATE PREVIEW COMPONENT
   ═══════════════════════════════════════════════ */
export default function PlatePreview({
  registration,
  plateStyle = '4d-5mm',
  showToggle = true,
}: PlatePreviewProps) {
  const [isRear, setIsRear] = useState(true)

  const rawText = (registration || 'YOUR REG').toUpperCase()
  const displayText = rawText.replace(/[^A-Z0-9\s]/g, '')

  const rearBg = '#facc15'
  const frontBg = '#f5f5f5'
  const bg = isRear ? rearBg : frontBg

  const styleInfo = styleConfig[plateStyle]
  const borderRadius = plateStyle === '4d-gel' ? '7px' : '5px'

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      {/* The Plate */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: bg,
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius,
          padding: 'clamp(4px, 1.2vw, 8px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(4px, 1vw, 8px)',
          boxShadow: `0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,${isRear ? '0.3' : '0.6'}), inset 0 -1px 0 rgba(0,0,0,0.04)`,
          transition: 'all 0.4s ease',
          aspectRatio: '520 / 111',
        }}>
          {/* Inner border line */}
          <div style={{
            position: 'absolute',
            inset: 'clamp(3px, 0.8vw, 6px)',
            border: plateStyle === 'ghost' ? '1px solid rgba(0,0,0,0.03)' : '1px solid rgba(0,0,0,0.1)',
            borderRadius: '3px',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* GB Badge */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
            <GBBadge />
          </div>

          {/* Vertical separator */}
          <div style={{
            width: '1px',
            height: '75%',
            backgroundColor: plateStyle === 'ghost' ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.12)',
            flexShrink: 0,
            position: 'relative',
            zIndex: 2,
          }} />

          {/* Registration characters */}
          <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <PlateChars text={displayText} style={plateStyle} isRear={isRear} />
          </div>

          {/* BSAU145e marking */}
          <div style={{ position: 'absolute', bottom: 'clamp(4px, 1vw, 8px)', right: 'clamp(6px, 1.5vw, 12px)', zIndex: 3 }}>
            <span style={{
              fontFamily: "'Arial', sans-serif",
              fontSize: 'clamp(4px, 1vw, 6px)',
              color: plateStyle === 'ghost' ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.25)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}>
              BSAU145e
            </span>
          </div>

          {/* PNP manufacturer mark */}
          <div style={{ position: 'absolute', bottom: 'clamp(4px, 1vw, 8px)', left: '52px', zIndex: 3 }}>
            <span style={{
              fontFamily: "'Arial', sans-serif",
              fontSize: 'clamp(3px, 0.8vw, 5px)',
              color: plateStyle === 'ghost' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}>
              PNP
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      {showToggle && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px',
          maxWidth: '520px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              color: '#757575',
              textTransform: 'uppercase',
            }}>
              {styleInfo.label}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#ffd700',
            }}>
              &pound;{styleInfo.price}
            </span>
          </div>

          <div style={{
            display: 'flex',
            backgroundColor: '#1a1a1a',
            borderRadius: '9999px',
            padding: '3px',
            gap: '2px',
          }}>
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
