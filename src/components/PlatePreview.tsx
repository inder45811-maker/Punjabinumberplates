import { useState, useMemo } from 'react'

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
   3D EXTRUDED CHARACTER
   Multi-layer text-shadow creates physical depth
   ═══════════════════════════════════════════════ */
function Char3D({
  char,
  fontSize,
  plateStyle,
  isRear,
}: {
  char: string
  fontSize: string
  plateStyle: PlateStyle
  isRear: boolean
}) {
  if (char === ' ') {
    return <span style={{ display: 'inline-block', width: `calc(${fontSize} * 0.45)` }} />
  }

  const depths: Record<PlateStyle, number> = { '4d-5mm': 7, '4d-gel': 9, '3d-gel': 6, 'ghost': 2 }
  const depth = depths[plateStyle]

  const frontC: Record<PlateStyle, string> = {
    '4d-5mm': '#111', '4d-gel': '#0a0a0a', '3d-gel': '#161616',
    'ghost': isRear ? 'rgba(40,40,40,0.32)' : 'rgba(40,40,40,0.28)',
  }
  const sideC: Record<PlateStyle, string> = {
    '4d-5mm': '#2a2a2a', '4d-gel': '#222', '3d-gel': '#3a3a3a',
    'ghost': isRear ? 'rgba(40,40,40,0.14)' : 'rgba(40,40,40,0.10)',
  }

  const sideCol = sideC[plateStyle]
  const shadows: string[] = []
  for (let i = 1; i <= depth; i++) {
    if (sideCol.startsWith('rgba')) {
      const alpha = Math.max(0.04, 0.40 - i * 0.04)
      shadows.push(`0 ${i}px 0 ${sideCol.replace(/[\d.]+\)$/, `${alpha.toFixed(2)})`)}`)
    } else {
      shadows.push(`0 ${i}px 0 ${sideCol}`)
    }
  }
  shadows.push(`0 ${depth + 2}px ${depth + 2}px rgba(0,0,0,0.12)`)
  shadows.push(`0 ${depth + 6}px ${depth + 8}px rgba(0,0,0,0.06)`)

  return (
    <span style={{
      display: 'inline-block',
      position: 'relative',
      fontFamily: "Impact, 'Arial Black', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif",
      fontWeight: 900,
      fontSize,
      lineHeight: 1,
      letterSpacing: '0.02em',
      color: frontC[plateStyle],
      textTransform: 'uppercase',
      fontStretch: 'condensed',
      textShadow: shadows.join(', '),
      transform: `translateY(-${Math.floor(depth / 2)}px)`,
      marginBottom: `${depth + 4}px`,
      paddingTop: `${Math.floor(depth / 2)}px`,
    }}>
      {char}
    </span>
  )
}

/* ═══ GB BADGE ═══ */
function GBBadge() {
  return (
    <svg width="34" height="72" viewBox="0 0 34 72" style={{ display: 'block', flexShrink: 0 }}>
      <defs><clipPath id="bc"><rect x="1" y="1" width="32" height="70" rx="3"/></clipPath></defs>
      <rect x="1" y="1" width="32" height="70" rx="3" fill="#0D47A1" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
      <g clipPath="url(#bc)" opacity="0.55">
        <rect x="1" y="1" width="32" height="70" fill="#0D47A1"/>
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

/* ═══ MAIN ═══ */
export default function PlatePreview({ registration, plateStyle = '4d-5mm', showToggle = true }: PlatePreviewProps) {
  const [isRear, setIsRear] = useState(true)
  const cleanText = (registration || 'YOUR REG').toUpperCase().replace(/[^A-Z0-9\s]/g, '').trim() || 'YOUR REG'
  const charCount = cleanText.replace(/\s/g, '').length
  const fontSize = charCount <= 4 ? '3.8rem' : charCount <= 6 ? '3rem' : charCount <= 8 ? '2.4rem' : '1.9rem'
  const bg = isRear ? '#facc15' : '#f5f5f5'
  const si = styleConfig[plateStyle]
  const groups = useMemo(() => cleanText.split(/(\s+)/).filter(Boolean), [cleanText])

  return (
    <div style={{ width: '100%' }}>
      {/* 3D Perspective Plate */}
      <div style={{ perspective: '1400px', padding: '10px 0' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', transform: 'rotateX(3deg)', transformStyle: 'preserve-3d' }}>
          <div style={{
            position: 'relative', backgroundColor: bg, borderRadius: '8px',
            padding: 'clamp(6px, 1.4vw, 10px)',
            boxShadow: `0 1px 0 rgba(255,255,255,${isRear ? '0.35' : '0.55'}) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 2px 6px rgba(0,0,0,0.10), 0 10px 30px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.04)`,
            transition: 'background-color 0.35s ease',
          }}>
            {/* Bottom thickness */}
            <div style={{ position: 'absolute', left: '5px', right: '5px', bottom: '-5px', height: '5px', background: isRear ? 'linear-gradient(to bottom, #e8c414, #c9a810)' : 'linear-gradient(to bottom, #ddd, #bbb)', borderRadius: '0 0 6px 6px', zIndex: -1 }} />
            {/* Inner border */}
            <div style={{ position: 'absolute', inset: '3px', border: plateStyle === 'ghost' ? '1px solid rgba(0,0,0,0.03)' : '1px solid rgba(0,0,0,0.13)', borderRadius: '5px', pointerEvents: 'none', zIndex: 1 }} />
            {/* Content */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.4vw, 12px)', position: 'relative', zIndex: 2 }}>
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}><GBBadge /></div>
              <div style={{ width: '1px', height: '58px', backgroundColor: plateStyle === 'ghost' ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.12)', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '58px', overflow: 'hidden', padding: '0 4px', gap: '0.06em' }}>
                {groups.map((group, gi) => (
                  <span key={gi} style={{ display: 'inline-flex', whiteSpace: 'nowrap', alignItems: 'center' }}>
                    {group.split('').map((char, ci) => (
                      <Char3D key={ci} char={char} fontSize={fontSize} plateStyle={plateStyle} isRear={isRear} />
                    ))}
                  </span>
                ))}
              </div>
            </div>
            {/* BSAU145e */}
            <div style={{ position: 'absolute', bottom: '5px', right: '8px', zIndex: 3 }}>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 'clamp(3px, 0.7vw, 5px)', color: plateStyle === 'ghost' ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.22)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>BSAU145e</span>
            </div>
            {/* PNP */}
            <div style={{ position: 'absolute', bottom: '5px', left: '44px', zIndex: 3 }}>
              <span style={{ fontFamily: 'Arial, sans-serif', fontSize: 'clamp(3px, 0.6vw, 4px)', color: plateStyle === 'ghost' ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.16)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>PUNJABI NUMBER PLATES</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {showToggle && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
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
