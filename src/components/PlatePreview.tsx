interface PlatePreviewProps {
  registration: string
  styleLabel?: string
  side?: PlateSide
}

interface PlateFaceProps extends PlatePreviewProps {
  className?: string
  decorative?: boolean
}

interface PlateHolderPreviewProps {
  holderText: string
  registration?: string
  styleLabel?: string
  side?: PlateSide
}

type PlateSide = 'front' | 'rear'

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

function cleanHolderText(value: string) {
  return (
    (value || 'YOUR NAME')
      .toUpperCase()
      .replace(/[^A-Z0-9&\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim() || 'YOUR NAME'
  )
}

function holderFontSizeFor(value: string) {
  const count = value.replace(/\s/g, '').length
  if (count <= 7) return 38
  if (count <= 10) return 32
  if (count <= 14) return 27
  return 23
}

function PlateFace({
  registration,
  styleLabel = 'Custom plate',
  side = 'rear',
  className,
  decorative = false,
}: PlateFaceProps) {
  const text = cleanRegistration(registration)
  const isRear = side === 'rear'
  const fontSize = fontSizeFor(text)
  const classes = ['plate-preview__plate', `plate-preview__plate--${side}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={decorative ? undefined : `${isRear ? 'Rear' : 'Front'} ${styleLabel} preview for ${text}`}
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
  )
}

export default function PlatePreview({
  registration,
  styleLabel = 'Custom plate',
  side = 'rear',
}: PlatePreviewProps) {
  const text = cleanRegistration(registration)
  const isRear = side === 'rear'

  return (
    <figure className="plate-preview" aria-label={`${styleLabel} live plate preview`}>
      <PlateFace registration={text} styleLabel={styleLabel} side={side} />
      <figcaption>
        <span>{styleLabel}</span>
        <span>{isRear ? 'Rear plate' : 'Front plate'}</span>
      </figcaption>
    </figure>
  )
}

export function PlateHolderPreview({
  holderText,
  registration = 'YOUR REG',
  styleLabel = 'Luxury plate holder',
  side = 'rear',
}: PlateHolderPreviewProps) {
  const text = cleanHolderText(holderText)
  const fontSize = holderFontSizeFor(text)

  return (
    <figure className="holder-preview" aria-label={`${styleLabel} live holder preview`}>
      <div
        className="holder-preview__stage"
        role="img"
        aria-label={`${styleLabel} preview with ${text} holder text`}
      >
        <div className="holder-preview__frame">
          <div className="holder-preview__plate-slot">
            <PlateFace
              registration={registration}
              styleLabel={styleLabel}
              side={side}
              className="holder-preview__plate"
              decorative
            />
          </div>
          <div className="holder-preview__name-rail" aria-hidden="true">
            <span className="holder-preview__emblem" />
            <span
              className="holder-preview__name"
              style={{ fontSize: `clamp(0.78rem, ${fontSize / 7.4}vw, ${fontSize}px)` }}
            >
              {text}
            </span>
            <span className="holder-preview__emblem" />
          </div>
        </div>
      </div>
      <figcaption>
        <span>{styleLabel}</span>
        <span>Holder preview</span>
      </figcaption>
    </figure>
  )
}
