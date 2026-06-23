interface PlatePreviewProps {
  registration: string
  styleLabel?: string
  side?: 'front' | 'rear'
}

function cleanRegistration(value: string) {
  return (
    (value || 'YOUR REG')
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim() || 'YOUR REG'
  )
}

function fontSizeFor(value: string) {
  const count = value.replace(/\s/g, '').length
  if (count <= 5) return 72
  if (count <= 7) return 64
  if (count <= 9) return 54
  return 44
}

export default function PlatePreview({
  registration,
  styleLabel = 'Custom plate',
  side = 'rear',
}: PlatePreviewProps) {
  const text = cleanRegistration(registration)
  const isRear = side === 'rear'
  const fontSize = fontSizeFor(text)

  return (
    <figure className="plate-preview" aria-label={`${styleLabel} live plate preview`}>
      <div
        className={`plate-preview__plate plate-preview__plate--${side}`}
        role="img"
        aria-label={`${isRear ? 'Rear' : 'Front'} ${styleLabel} preview for ${text}`}
      >
        <div className="plate-preview__text-wrap">
          <span
            className="plate-preview__text"
            style={{ fontSize: `clamp(1.75rem, ${fontSize / 5.2}vw, ${fontSize}px)` }}
          >
            {text}
          </span>
        </div>
        <span className="plate-preview__maker" aria-hidden="true">
          THE NUMBER PLATE SHOP
        </span>
        <span className="plate-preview__bsau" aria-hidden="true">
          BSAU145e
        </span>
      </div>
      <figcaption>
        <span>{styleLabel}</span>
        <span>{isRear ? 'Rear plate' : 'Front plate'}</span>
      </figcaption>
    </figure>
  )
}
