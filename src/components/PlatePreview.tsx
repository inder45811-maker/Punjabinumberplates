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
   Blue rectangle, Union Jack, GB text
   ═══════════════════════════════════════════════ */
function GBBadge() {
  return (
    <svg width="44" height="90" viewBox="0 0 44 90" style={{ flexShrink: 0, display: 'block' }}>
      {/* Blue background */}
      <rect x="0.5" y="0.5" width="43" height="89" rx="4" fill="#003399" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      {/* Union Jack — top section */}
      <g opacity="0.6">
        <rect x="2" y="2" width="40" height="35" fill="#003399" />
        {/* White diagonals */}
        <polygon points="2,2 20,19.5 18,21.5 2,6" fill="#fff" opacity="0.4" />
        <polygon points="42,2 24,19.5 26,21.5 42,6" fill="#fff" opacity="0.4" />
        <polygon points="2,37 20,19.5 18,17.5 2,33" fill="#fff" opacity="0.4" />
        <polygon points="42,37 24,19.5 26,17.5 42,33" fill="#fff" opacity="0.4" />
        {/* White cross */}
        <rect x="19" y="2" width="6" height="35" fill="#fff" opacity="0.5" />
        <rect x="2" y="16.5" width="40" height="6" fill="#fff" opacity="0.5" />
        {/* Red cross */}
        <rect x="20.5" y="2" width="3" height="35" fill="#cc0000" opacity="0.5" />
        <rect x="2" y="18" width="40" height="3" fill="#cc0000" opacity="0.5" />
        {/* Red diagonals */}
        <polygon points="2,2 14,14 12,16 2,6" fill="#cc0000" opacity="0.4" />
        <polygon points="42,2 30,14 32,16 42,6" fill="#cc0000" opacity="0.4" />
        <polygon points="2,37 14,25 12,23 2,33" fill="#cc0000" opacity="0.4" />
        <polygon points="42,37 30,25 32,23 42,33" fill="#cc0000" opacity="0.4" />
      </g>
      {/* GB text */}
      <text x="22" y="82" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="10" letterSpacing="0.5">GB</text>
    </svg>
  )
}

/* ═══════════════════════════════════════════════
   CHARLES WRIGHT FONT APPROXIMATION
   UK plates use Charles Wright font — very specific look.
   We approximate with a heavy condensed sans + tight spacing.
   ═══════════════════════════════════════════════ */
function getPlateFontStyle(totalChars: number): React.CSSProperties {
  // Scale font based on character count to fit plate
  const fontSize = totalChars <= 5 ? '3.6rem' : totalChars <= 7 ? '2.8rem' : totalChars <= 9 ? '2.2rem' : '1.7rem'
  return {
    fontFamily: "'Arial Black', 'Arial Bold', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontWeight: 900,
    fontSize,
    letterSpacing: '0.06em',
    lineHeight: 1,
    textRendering: 'geometricPrecision' as const,
  }
}

/* ═══════════════════════════════════════════════
   4D 5MM STYLE — Raised acrylic characters
   ═══════════════════════════════════════════════ */
function get4D5mmStyle(textColor: string): React.CSSProperties {
  return {
    color: textColor,
    textShadow: `
      0 0.5px 0 rgba(0,0,0,0.4),
      0 1px 0 rgba(0,0,0,0.3),
      0 1.5px 0 rgba(0,0,0,0.2),
      0 2px 0 rgba(0,0,0,0.15),
      0 2.5px 1px rgba(0,0,0,0.1),
      0 3px 3px rgba(0,0,0,0.12),
      0 4px 6px rgba(0,0,0,0.08)
    `,
  }
}

/* ═══════════════════════════════════════════════
   4D GEL STYLE — Glossy gel-coated characters
   ═══════════════════════════════════════════════ */
function get4DGelStyle(textColor: string): React.CSSProperties {
  return {
    color: textColor,
    textShadow: `
      0 0.5px 0.5px rgba(0,0,0,0.3),
      0 1px 1px rgba(0,0,0,0.25),
      0 1.5px 1.5px rgba(0,0,0,0.2),
      0 2px 2px rgba(0,0,0,0.15),
      0 3px 4px rgba(0,0,0,0.1),
      0 4px 8px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.2)
    `,
  }
}

/* ═══════════════════════════════════════════════
   3D GEL STYLE — Domed/rounded characters
   ═══════════════════════════════════════════════ */
function get3DGelStyle(textColor: string): React.CSSProperties {
  return {
    color: textColor,
    textShadow: `
      0 1px 0 rgba(0,0,0,0.25),
      0 2px 0 rgba(0,0,0,0.2),
      0 3px 1px rgba(0,0,0,0.15),
      0 4px 3px rgba(0,0,0,0.1),
      0 5px 6px rgba(0,0,0,0.08)
    `,
    transform: 'translateY(-1px)',
  }
}

/* ═══════════════════════════════════════════════
   GHOST STYLE — Subtle/faint characters
   ═══════════════════════════════════════════════ */
function getGhostStyle(isRear: boolean): React.CSSProperties {
  return {
    color: isRear ? 'rgba(30,30,30,0.4)' : 'rgba(30,30,30,0.35)',
    textShadow: 'none',
  }
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
  const totalChars = displayText.replace(/\s/g, '').length

  const rearBg = '#facc15'
  const frontBg = '#f5f5f5'
  const bg = isRear ? rearBg : frontBg
  const textColor = plateStyle === 'ghost'
    ? (isRear ? 'rgba(30,30,30,0.4)' : 'rgba(30,30,30,0.35)')
    : '#0a0a0a'

  const styleInfo = styleConfig[plateStyle]

  // Build character style based on plate type
  const getStyleOverride = (): React.CSSProperties => {
    switch (plateStyle) {
      case '4d-5mm': return get4D5mmStyle(textColor)
      case '4d-gel': return get4DGelStyle(textColor)
      case '3d-gel': return get3DGelStyle(textColor)
      case 'ghost': return getGhostStyle(isRear)
    }
  }

  const fontStyle = getPlateFontStyle(totalChars)
  const styleOverride = getStyleOverride()
  const charStyle: React.CSSProperties = { ...fontStyle, ...styleOverride }

  // Split text into space-separated groups
  const groups = displayText.trim().split(/\s+/).filter(Boolean)

  return (
    <div style={{ width: '100%' }}>
      {/* ═══ The Plate Body ═══ */}
      <div style={{ width: '100%', maxWidth: '540px', margin: '0 auto' }}>
        <div
          style={{
            position: 'relative',
            backgroundColor: bg,
            borderRadius: '5px',
            padding: 'clamp(5px, 1.5vw, 10px)',
            boxShadow: `
              0 1px 2px rgba(0,0,0,0.08),
              0 4px 12px rgba(0,0,0,0.06),
              0 8px 24px rgba(0,0,0,0.04),
              inset 0 1px 0 rgba(255,255,255,${isRear ? '0.25' : '0.5'}),
              inset 0 -1px 0 rgba(0,0,0,0.03)
            `,
            transition: 'background-color 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          {/* Inner border line (BS AU 145e requirement) */}
          <div style={{
            position: 'absolute',
            top: '3px',
            left: '3px',
            right: '3px',
            bottom: '3px',
            border: plateStyle === 'ghost' ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(0,0,0,0.15)',
            borderRadius: '3px',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Main plate content row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(4px, 1vw, 10px)',
            position: 'relative',
            zIndex: 2,
          }}>
            {/* GB Badge */}
            <GBBadge />

            {/* Vertical separator line */}
            <div style={{
              width: '1px',
              height: '70px',
              backgroundColor: plateStyle === 'ghost' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.15)',
              flexShrink: 0,
              alignSelf: 'center',
            }} />

            {/* Registration characters */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '70px',
              overflow: 'hidden',
              padding: '0 4px',
            }}>
              {groups.map((group, gi) => (
                <span
                  key={gi}
                  style={{
                    display: 'inline-flex',
                    whiteSpace: 'nowrap',
                    alignItems: 'center',
                  }}
                >
                  {gi > 0 && (
                    <span style={{
                      display: 'inline-block',
                      width: 'clamp(8px, 2vw, 18px)',
                      flexShrink: 0,
                    }} />
                  )}
                  {group.split('').map((char, ci) => (
                    <span
                      key={ci}
                      style={charStyle}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          {/* BSAU145e marking — bottom right */}
          <div style={{
            position: 'absolute',
            bottom: '5px',
            right: '8px',
            zIndex: 3,
          }}>
            <span style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 'clamp(3px, 0.7vw, 5px)',
              color: plateStyle === 'ghost' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.2)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}>
              BSAU145e
            </span>
          </div>

          {/* Manufacturer mark — bottom left (next to GB badge area) */}
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '50px',
            zIndex: 3,
          }}>
            <span style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 'clamp(3px, 0.6vw, 4px)',
              color: plateStyle === 'ghost' ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.18)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}>
              PNP
            </span>
          </div>
        </div>
      </div>

      {/* ═══ Controls ═══ */}
      {showToggle && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '14px',
          maxWidth: '540px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {/* Style + Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

          {/* Front / Rear toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: '#1a1a1a',
            borderRadius: '9999px',
            padding: '3px',
            gap: '2px',
          }}>
            <button
              onClick={() => setIsRear(false)}
              style={{
                padding: '5px 14px',
                borderRadius: '9999px',
                border: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: !isRear ? '#f5f5f5' : 'transparent',
                color: !isRear ? '#050401' : '#757575',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Front
            </button>
            <button
              onClick={() => setIsRear(true)}
              style={{
                padding: '5px 14px',
                borderRadius: '9999px',
                border: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: isRear ? '#ffd700' : 'transparent',
                color: isRear ? '#050401' : '#757575',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Rear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
