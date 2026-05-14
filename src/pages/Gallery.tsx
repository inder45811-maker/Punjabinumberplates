import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router'
import { ArrowRight, X, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'

/* ──────────────────────────────────────────────
   COLORS
   ────────────────────────────────────────────── */

const C = {
  bg: '#050401',
  card: '#111111',
  text: '#f2f3f4',
  gold: '#ffd700',
  muted: '#757575',
  border: '#222222',
}

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const heroSrcSet = [
  '/pnp-collection-hero.jpg',
  '/pnp-07.jpg',
  '/pnp-05.jpg',
  '/pnp-06.jpg',
  '/pnp-03.jpg',
]

const stats = [
  { number: '10+', label: 'PLATE STYLES' },
  { number: '24H', label: 'SAME DAY DISPATCH' },
]

const galleryItems = [
  { id: 1, image: '/pnp-01.jpg', type: 'STANDARD', vehicle: 'Number Plate', customer: 'Standard Plates', likes: 124, aspect: '4/3' },
  { id: 2, image: '/pnp-02.jpg', type: '2D SHORT', vehicle: 'Short Plate', customer: '2D Short Printed', likes: 98, aspect: '3/4' },
  { id: 3, image: '/pnp-03.jpg', type: '3D GEL', vehicle: 'Road Legal', customer: '3D Gel Plates', likes: 156, aspect: '1/1' },
  { id: 4, image: '/pnp-04.jpg', type: '4D 3MM', vehicle: 'Acrylic Plate', customer: '4D 3MM Acrylic', likes: 87, aspect: '16/9' },
  { id: 5, image: '/pnp-05.jpg', type: '4D GEL', vehicle: 'Road Legal', customer: '4D Gel Plates', likes: 203, aspect: '4/3' },
  { id: 6, image: '/pnp-06.jpg', type: 'GHOST', vehicle: 'Ghost Plate', customer: 'Ghost Plates', likes: 112, aspect: '3/4' },
  { id: 7, image: '/pnp-07.jpg', type: '4D 5MM', vehicle: 'Road Legal', customer: '4D 5MM Plates', likes: 245, aspect: '4/3' },
  { id: 8, image: '/pnp-08.jpg', type: 'RETRO', vehicle: 'Bevelled Plate', customer: 'Retro Bevelled', likes: 76, aspect: '1/1' },
  { id: 9, image: '/pnp-09.jpg', type: 'HEX', vehicle: 'Hex Plate', customer: 'Hex Plates', likes: 134, aspect: '16/9' },
  { id: 10, image: '/pnp-10.jpg', type: 'BUNDLE', vehicle: 'Hex Bundle', customer: 'Hex Bundle Deal', likes: 167, aspect: '3/4' },
  { id: 11, image: '/pnp-11.jpg', type: '4D GEL', vehicle: 'Detail Shot', customer: '4D Gel Detail', likes: 189, aspect: '4/3' },
  { id: 12, image: '/pnp-12.jpg', type: 'BUNDLE', vehicle: 'Premium Bundle', customer: 'Bundle Detail', likes: 143, aspect: '1/1' },
]

const lightboxImages = [
  '/pnp-01.jpg',
  '/pnp-02.jpg',
  '/pnp-03.jpg',
  '/pnp-04.jpg',
  '/pnp-05.jpg',
  '/pnp-06.jpg',
  '/pnp-07.jpg',
  '/pnp-08.jpg',
]

/* ──────────────────────────────────────────────
   MAIN EXPORT
   ────────────────────────────────────────────── */

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [heroIndex, setHeroIndex] = useState(0)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const nextLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
  }, [])

  const prevLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
  }, [])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextLightbox()
      if (e.key === 'ArrowLeft') prevLightbox()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, closeLightbox, nextLightbox, prevLightbox])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSrcSet.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      <HeroSection heroIndex={heroIndex} />
      <StatsRow />
      <GalleryGrid items={galleryItems} onOpenLightbox={openLightbox} />
      <SubmitSection />

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextLightbox}
          onPrev={prevLightbox}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════ */

function HeroSection({ heroIndex }: { heroIndex: number }) {
  return (
    <section
      style={{
        position: 'relative',
        height: 'clamp(400px, 60vh, 700px)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {heroSrcSet.map((src, i) => (
        <div
          key={src}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: i === heroIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,4,1,0.6), rgba(5,4,1,0.9))',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '24px',
          maxWidth: '800px',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            color: C.gold,
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          OUR WORK
        </p>
        <h1
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            letterSpacing: '-0.05em',
            lineHeight: 0.95,
            color: C.text,
            textTransform: 'uppercase',
            margin: '0 0 16px 0',
          }}
        >
          THE GALLERY
        </h1>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '1rem',
            color: C.muted,
            maxWidth: '480px',
            lineHeight: 1.6,
            margin: '0 auto',
          }}
        >
          Explore our collection of handcrafted number plates. Every plate tells a story.
        </p>

        {/* Dots */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '32px',
          }}
        >
          {heroSrcSet.map((_, i) => (
            <button
              key={i}
              onClick={() => {}}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: i === heroIndex ? C.gold : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   STATS ROW
   ═══════════════════════════════════════════════ */

function StatsRow() {
  return (
    <section
      style={{
        backgroundColor: C.card,
        padding: '32px 24px',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(48px, 10vw, 120px)',
          flexWrap: 'wrap',
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                letterSpacing: '-0.03em',
                color: C.gold,
                lineHeight: 1,
              }}
            >
              {stat.number}
            </div>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: C.muted,
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   GALLERY GRID
   ═══════════════════════════════════════════════ */

function GalleryGrid({
  items,
  onOpenLightbox,
}: {
  items: typeof galleryItems
  onOpenLightbox: (index: number) => void
}) {
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set())

  const toggleLike = useCallback((id: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  return (
    <section
      style={{
        backgroundColor: C.bg,
        padding: '80px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '48px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <h2
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              letterSpacing: '-0.05em',
              color: C.text,
              textTransform: 'uppercase',
              lineHeight: 1,
              margin: 0,
            }}
          >
            PLATE GALLERY
          </h2>
          <Link
            to="/product"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '9999px',
              border: `1px solid ${C.muted}`,
              backgroundColor: 'transparent',
              color: C.text,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '0.85rem',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'border-color 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.gold
              e.currentTarget.style.color = C.gold
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.muted
              e.currentTarget.style.color = C.text
            }}
          >
            BUILD YOUR PLATE
            <ArrowRight size={16} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {items.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              isLiked={likedItems.has(item.id)}
              onToggleLike={() => toggleLike(item.id)}
              onOpenLightbox={() => onOpenLightbox(i % lightboxImages.length)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   GALLERY CARD
   ═══════════════════════════════════════════════ */

function GalleryCard({
  item,
  isLiked,
  onToggleLike,
  onOpenLightbox,
}: {
  item: (typeof galleryItems)[0]
  isLiked: boolean
  onToggleLike: () => void
  onOpenLightbox: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        backgroundColor: C.card,
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(255, 215, 0, 0.3)' : C.border}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 32px rgba(0, 0, 0, 0.4)' : 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: item.aspect,
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={onOpenLightbox}
      >
        <img
          src={item.image}
          alt={`${item.type} — ${item.vehicle}`}
          width="400"
          height="300"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            padding: '4px 12px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 215, 0, 0.9)',
            color: C.bg,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {item.type}
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '-0.02em',
                color: C.text,
                textTransform: 'uppercase',
                margin: '0 0 2px 0',
              }}
            >
              {item.vehicle}
            </h3>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.75rem',
                color: C.muted,
                margin: 0,
              }}
            >
              {item.customer}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleLike()
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: isLiked ? C.gold : C.muted,
                transition: 'color 0.2s ease',
                padding: '4px',
              }}
            >
              <Heart
                size={16}
                fill={isLiked ? C.gold : 'none'}
                stroke={isLiked ? C.gold : 'currentColor'}
              />
              <span
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {item.likes + (isLiked ? 1 : 0)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════ */

function Lightbox({
  images,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  images: string[]
  index: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(5, 4, 1, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          background: 'none',
          border: 'none',
          color: C.text,
          cursor: 'pointer',
          padding: '8px',
          zIndex: 10,
        }}
      >
        <X size={28} />
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: C.text,
          cursor: 'pointer',
          padding: '8px',
          zIndex: 10,
        }}
      >
        <ChevronLeft size={36} />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: C.text,
          cursor: 'pointer',
          padding: '8px',
          zIndex: 10,
        }}
      >
        <ChevronRight size={36} />
      </button>

      {/* Image */}
      <div
        style={{
          maxWidth: '90vw',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={`Gallery image ${index + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
        />
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.8rem',
            color: C.muted,
            marginTop: '16px',
          }}
        >
          {index + 1} / {images.length}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   SUBMIT SECTION
   ═══════════════════════════════════════════════ */

function SubmitSection() {
  return (
    <section
      style={{
        backgroundColor: C.card,
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            letterSpacing: '-0.05em',
            color: C.text,
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          SHARE YOUR PLATE
        </h2>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '1rem',
            color: C.muted,
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          Had your Punjabi Number Plate installed? Send us a photo and we&apos;ll feature it in our gallery.
        </p>
        <a
          href="mailto:info@punjabinumberplates.co.uk?subject=Gallery Submission"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 32px',
            borderRadius: '9999px',
            border: `1px solid ${C.muted}`,
            backgroundColor: 'transparent',
            color: C.text,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'border-color 0.3s ease, color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.gold
            e.currentTarget.style.color = C.gold
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.muted
            e.currentTarget.style.color = C.text
          }}
        >
          <Share2 size={16} />
          SUBMIT YOUR PHOTO
        </a>
      </div>
    </section>
  )
}
