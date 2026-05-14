import { useState } from 'react'

export type PlateStyle = '4d-5mm' | '4d-gel' | '3d-gel' | 'ghost'

interface PlatePreviewProps {
  registration: string
  plateStyle?: PlateStyle
  showToggle?: boolean
}

const styleLabels: Record<PlateStyle, string> = {
  '4d-5mm': '4D 5MM',
  '4d-gel': '4D GEL',
  '3d-gel': '3D GEL',
  'ghost': 'GHOST',
}

function GB_Badge({ isRear }: { isRear: boolean }) {
  return (
    <svg
      width="28"
      height="38"
      viewBox="0 0 28 38"
      style={{ flexShrink: 0, height: '70%', alignSelf: 'center' }}
    >
      {/* Badge background */}
      <rect x="0" y="0" width="28" height="38" rx="3" fill={isRear ? '#1d4e9d' : '#1d4e9d'} />
      {/* Union Jack pattern */}
      <g opacity="0.6">
        <rect x="1" y="1" width="12" height="12" fill="#c8102e" />
        <rect x="15" y="1" width="12" height="12" fill="#fff" />
        <rect x="1" y="15" width="12" height="12" fill="#012169" />
        <rect x="15" y="15" width="12" height="12" fill="#c8102e" />
        {/* Cross overlay */}
        <rect x="12" y="1" width="4" height="26" fill="#fff" opacity="0.8" />
        <rect x="1" y="12" width="26" height="4" fill="#fff" opacity="0.8" />
      </g>
      {/* EU ring removed - post-Brexit */}
      <text
        x="14"
        y="32"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="7"
      >
        GB
      </text>
    </svg>
  )
}

export default function PlatePreview({
  registration,
  plateStyle = '4d-5mm',
  showToggle = true,
}: PlatePreviewProps) {
  const [isRear, setIsRear] = useState(true)

  const text = (registration || 'YOUR REG').toUpperCase()
  const len = text.length
  const fontSize = len <= 4 ? '3.2rem' : len <= 6 ? '2.6rem' : len <= 8 ? '2rem' : '1.6rem'

  const rearBg = '#FFBB00'
  const frontBg = '#F8F8F8'
  const bg = isRear ? rearBg : frontBg

  // Style-specific character rendering
  const getCharStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: "'Inter', system-ui, sans-serif",
      fontWeight: 800,
      fontSize,
      letterSpacing: '0.06em',
      lineHeight: 1,
      color: '#1a1a1a',
    }

    switch (plateStyle) {
      case '4d-5mm':
        return {
          ...base,
          textShadow: '1px 1px 0 rgba(0,0,0,0.3), 2px 2px 0 rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.2)',
          WebkitTextStroke: '0.5px rgba(0,0,0,0.05)',
        }
      case '4d-gel':
        return {
          ...base,
          color: '#000',
          textShadow: '0 1px 2px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.15), inset 0 -1px 1px rgba(255,255,255,0.3)',
          WebkitTextStroke: '0.3px rgba(0,0,0,0.1)',
        }
      case '3d-gel':
        return {
          ...base,
          color: '#1a1a1a',
          textShadow: '0 2px 0 rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.15)',
          transform: 'translateY(-1px)',
        }
      case 'ghost':
        return {
          ...base,
          color: isRear ? 'rgba(30,30,30,0.55)' : 'rgba(30,30,30,0.5)',
          textShadow: '0 0 2px rgba(0,0,0,0.1)',
        }
      default:
        return base
    }
  }

  const getPlateBorder = (): string => {
    switch (plateStyle) {
      case '4d-5mm':
        return '3px solid #1a1a1a'
      case '4d-gel':
        return '3px solid #0a0a0a'
      case '3d-gel':
        return '2.5px solid #1a1a1a'
      case 'ghost':
        return isRear ? '2px solid rgba(0,0,0,0.08)' : '2px solid rgba(0,0,0,0.06)'
      default:
        return '3px solid #1a1a1a'
    }
  }

  const getInnerBorder = (): string => {
    switch (plateStyle) {
      case 'ghost':
        return 'none'
      default:
        return '1.5px solid rgba(0,0,0,0.15)'
    }
  }

  const getBorderRadius = (): number => {
    switch (plateStyle) {
      case '4d-gel':
        return 6
      default:
        return 4
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Plate */}
      <div
        style={{
          backgroundColor: bg,
          border: getPlateBorder(),
          borderRadius: `${getBorderRadius()}px`,
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: plateStyle === 'ghost'
            ? '0 1px 3px rgba(0,0,0,0.06)'
            : '0 4px 20px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.4s ease',
          maxWidth: '100%',
        }}
      >
        {/* GB Badge */}
        <GB_Badge isRear={isRear} />

        {/* Inner border line */}
        <div
          style={{
            borderLeft: getInnerBorder(),
            height: '75%',
            alignSelf: 'center',
            opacity: plateStyle === 'ghost' ? 0 : 1,
          }}
        />

        {/* Registration text */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            minHeight: '50px',
          }}
        >
          <span style={getCharStyle()}>
            {text}
          </span>
        </div>
      </div>

      {/* Front/Rear toggle + Style label */}
      {showToggle && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '10px',
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              color: '#757575',
              textTransform: 'uppercase',
            }}
          >
            {styleLabels[plateStyle]}
          </span>

          <div
            style={{
              display: 'flex',
              backgroundColor: '#1a1a1a',
              borderRadius: '9999px',
              padding: '3px',
              gap: '2px',
            }}
          >
            <button
              onClick={() => setIsRear(false)}
              style={{
                padding: '5px 14px',
                borderRadius: '9999px',
                border: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: !isRear ? '#f2f3f4' : 'transparent',
                color: !isRear ? '#050401' : '#757575',
                fontWeight: 700,
              }}
            >
              FRONT
            </button>
            <button
              onClick={() => setIsRear(true)}
              style={{
                padding: '5px 14px',
                borderRadius: '9999px',
                border: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: isRear ? '#ffd700' : 'transparent',
                color: isRear ? '#050401' : '#757575',
                fontWeight: 700,
              }}
            >
              REAR
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
