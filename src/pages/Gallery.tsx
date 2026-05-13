import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────── design tokens ─────────────────────── */
const TOKENS = {
  bgVoid: '#050401',
  bgSurface: '#111111',
  textPrimary: '#f2f3f4',
  textMuted: '#757575',
  accentGold: '#ffd700',
  accentGoldDim: '#b8860b',
  accentGoldGlow: 'rgba(255, 215, 0, 0.15)',
  borderSubtle: '#222222',
  successGreen: '#4f8a4f',
  alertRed: '#d9534f',
}

const easeSmooth = 'cubic-bezier(0.23, 1, 0.32, 1)'

/* ─────────────────────── gallery data ─────────────────────── */
const TABS = [
  'ALL',
  '4D GEL',
  '3D',
  'SHOW PLATES',
  'CARBON',
  'STICKER PLATES',
  'SIGNATURE',
] as const
type Tab = (typeof TABS)[number]

interface GalleryItem {
  id: number
  image: string
  type: string
  vehicle: string
  customer: string
  likes: number
  aspect: string
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, image: '/plate-gallery-01.jpg', type: '4D GEL', vehicle: 'BMW M4', customer: 'James R.', likes: 124, aspect: '4/3' },
  { id: 2, image: '/plate-gallery-02.jpg', type: '4D GEL', vehicle: 'Porsche 911', customer: 'Sophie L.', likes: 98, aspect: '3/4' },
  { id: 3, image: '/plate-gallery-03.jpg', type: '3D', vehicle: 'Tesla Model 3', customer: 'Alex M.', likes: 156, aspect: '1/1' },
  { id: 4, image: '/plate-gallery-04.jpg', type: 'SHOW PLATES', vehicle: 'Range Rover', customer: 'Daniel K.', likes: 87, aspect: '16/9' },
  { id: 5, image: '/plate-gallery-05.jpg', type: 'CARBON', vehicle: 'Audi RS6', customer: 'Emma W.', likes: 203, aspect: '4/3' },
  { id: 6, image: '/plate-gallery-06.jpg', type: '4D GEL', vehicle: 'Mercedes AMG', customer: 'Oliver H.', likes: 112, aspect: '3/4' },
  { id: 7, image: '/plate-gallery-07.jpg', type: 'SIGNATURE', vehicle: 'Lamborghini', customer: 'Lucas P.', likes: 245, aspect: '4/3' },
  { id: 8, image: '/plate-gallery-08.jpg', type: 'STICKER PLATES', vehicle: 'Ford Mustang', customer: 'Mia T.', likes: 76, aspect: '1/1' },
  { id: 9, image: '/plate-gallery-01.jpg', type: '4D GEL', vehicle: 'BMW M3', customer: 'Ryan G.', likes: 134, aspect: '16/9' },
  { id: 10, image: '/plate-gallery-03.jpg', type: '3D', vehicle: 'Tesla Model S', customer: 'Zoe B.', likes: 167, aspect: '3/4' },
  { id: 11, image: '/plate-gallery-05.jpg', type: 'CARBON', vehicle: 'Audi R8', customer: 'Noah S.', likes: 189, aspect: '4/3' },
  { id: 12, image: '/plate-gallery-07.jpg', type: 'SIGNATURE', vehicle: 'Porsche Cayman', customer: 'Lily J.', likes: 143, aspect: '1/1' },
]

const HERO_IMAGES = [
  '/plate-gallery-01.jpg',
  '/plate-gallery-02.jpg',
  '/plate-gallery-03.jpg',
  '/plate-gallery-04.jpg',
  '/plate-gallery-05.jpg',
]

const PLATE_TYPES = [
  '4D GEL BLACK',
  '3D PLATE',
  'SHOW PLATE',
  'CARBON',
  'STICKER PLATE',
  'SIGNATURE',
]

/* ─────────────────────── reusable components ─────────────────────── */

function Overline({ text, color = TOKENS.accentGold }: { text: string; color?: string }) {
  return (
    <p
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.8rem',
        letterSpacing: '0.2em',
        color,
        textTransform: 'uppercase',
        marginBottom: '16px',
      }}
    >
      {text}
    </p>
  )
}

function Container({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={className}
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ─────────────────────── Section 1: Hero ─────────────────────── */
function GalleryHero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<(HTMLDivElement | null)[]>([])
  const textRef = useRef<HTMLDivElement>(null)
  const chevronRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Stagger background images
    gsap.fromTo(
      imagesRef.current.filter(Boolean),
      { opacity: 0, scale: 1.1 },
      {
        opacity: 0.4,
        scale: 1,
        duration: 1.5,
        stagger: 0.1,
        ease: 'expo.out',
      }
    )

    // Text entrance
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.1,
          ease: 'expo.out',
          delay: 0.3,
        }
      )
    }

    // Chevron bounce
    if (chevronRef.current) {
      gsap.fromTo(
        chevronRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 1.2 }
      )
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: TOKENS.bgVoid,
      }}
    >
      {/* Background Images — layered collage */}
      {HERO_IMAGES.map((src, i) => {
        const offsets = [
          { top: '-5%', left: '-5%', width: '45%', height: '50%' },
          { top: '-8%', right: '-3%', width: '40%', height: '55%' },
          { top: '30%', left: '-8%', width: '38%', height: '45%' },
          { bottom: '-5%', right: '5%', width: '42%', height: '50%' },
          { top: '20%', right: '-10%', width: '35%', height: '60%' },
        ]
        return (
          <div
            key={i}
            ref={(el) => { imagesRef.current[i] = el }}
            style={{
              position: 'absolute',
              ...offsets[i],
              opacity: 0,
              zIndex: 1,
            }}
          >
            <img
              src={src}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </div>
        )
      })}

      {/* Radial gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(5,4,1,0.95) 0%, transparent 70%)',
          zIndex: 5,
        }}
      />

      {/* Center Content */}
      <div
        ref={textRef}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '800px',
          padding: '0 24px',
        }}
      >
        <Overline text="THE COLLECTION" />
        <h1
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(2rem, 7vw, 6rem)',
            letterSpacing: '-2.4px',
            lineHeight: 0.9,
            color: TOKENS.textPrimary,
            textTransform: 'uppercase',
          }}
        >
          INSTALLED.
          <br />
          <span style={{ color: TOKENS.accentGold }}>ADMIRED.</span>
        </h1>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '1rem',
            color: TOKENS.textMuted,
            maxWidth: '500px',
            margin: '24px auto 0',
            lineHeight: 1.6,
          }}
        >
          Real plates. Real vehicles. Real craftsmanship.
        </p>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            marginTop: '48px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '500+', label: 'INSTALLATIONS' },
            { value: '50+', label: 'VEHICLE BRANDS' },
            { value: '5★', label: 'AVERAGE RATING' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: '2rem',
                  color: TOKENS.accentGold,
                  letterSpacing: '-1px',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  color: TOKENS.textMuted,
                  marginTop: '4px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={chevronRef}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          opacity: 0,
          animation: 'galleryBounce 1.5s ease-in-out infinite',
        }}
      >
        <ChevronDown size={24} color={TOKENS.accentGold} />
      </div>

      <style>{`
        @keyframes galleryBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  )
}

/* ─────────────────────── Section 2: Filter Bar ─────────────────────── */
function FilterBar({ activeTab, onTabChange }: { activeTab: Tab; onTabChange: (t: Tab) => void }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: '104px',
        zIndex: 50,
        padding: '16px 0',
        backgroundColor: TOKENS.bgVoid,
        borderBottom: `1px solid ${TOKENS.borderSubtle}`,
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {TABS.map((tab) => {
            const isActive = tab === activeTab
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: `all 0.3s ${easeSmooth}`,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  border: isActive
                    ? 'none'
                    : `1px solid ${TOKENS.borderSubtle}`,
                  backgroundColor: isActive
                    ? TOKENS.accentGold
                    : 'transparent',
                  color: isActive ? TOKENS.bgVoid : TOKENS.textMuted,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = TOKENS.accentGold
                    e.currentTarget.style.color = TOKENS.accentGold
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = TOKENS.borderSubtle
                    e.currentTarget.style.color = TOKENS.textMuted
                  }
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </Container>
    </div>
  )
}

/* ─────────────────────── Section 3: Masonry Grid ─────────────────────── */
function MasonryGrid({
  items,
  onItemClick,
}: {
  items: GalleryItem[]
  onItemClick: (item: GalleryItem, index: number) => void
}) {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.gallery-card')
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      }
    )
  }, { scope: gridRef, dependencies: [items] })

  // Distribute items into 4 columns for masonry effect
  const columns: GalleryItem[][] = [[], [], [], []]
  items.forEach((item, i) => {
    columns[i % 4].push(item)
  })

  return (
    <div style={{ backgroundColor: TOKENS.bgVoid, padding: '48px 0' }}>
      <Container>
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
          className="masonry-grid"
        >
          {items.map((item, idx) => (
            <GalleryCard
              key={`${item.id}-${idx}`}
              item={item}
              onClick={() => onItemClick(item, idx)}
            />
          ))}
        </div>
      </Container>

      <style>{`
        @media (max-width: 1023px) {
          .masonry-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 767px) {
          .masonry-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const aspectPadding =
    item.aspect === '4/3'
      ? '75%'
      : item.aspect === '3/4'
        ? '133%'
        : item.aspect === '16/9'
          ? '56%'
          : '100%'

  return (
    <div
      className="gallery-card"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <div style={{ paddingBottom: aspectPadding, position: 'relative' }}>
        <img
          src={item.image}
          alt={`${item.vehicle} — ${item.type}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: `transform 0.4s ${easeSmooth}`,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        {/* Hover Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(transparent 50%, rgba(5,4,1,0.9) 100%)',
            opacity: hovered ? 1 : 0,
            transition: `opacity 0.4s ${easeSmooth}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '16px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              backgroundColor: TOKENS.accentGold,
              color: TOKENS.bgVoid,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: '9999px',
              width: 'fit-content',
              marginBottom: '8px',
            }}
          >
            {item.type}
          </span>
          <h3
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: '1.125rem',
              color: TOKENS.textPrimary,
              letterSpacing: '-0.5px',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {item.vehicle}
          </h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '4px',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.8rem',
                color: TOKENS.textMuted,
              }}
            >
              {item.customer}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.8rem',
                color: TOKENS.textMuted,
              }}
            >
              <Heart size={12} /> {item.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────── Lightbox ─────────────────────── */
function Lightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[]
  currentIndex: number
  onClose: () => void
  onNavigate: (dir: 'prev' | 'next') => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const item = items[currentIndex]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNavigate('prev')
      if (e.key === 'ArrowRight') onNavigate('next')
    },
    [onClose, onNavigate]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!item) return null

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        backdropFilter: 'blur(20px)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'lightboxIn 0.3s ease forwards',
      }}
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
          cursor: 'pointer',
          color: TOKENS.textPrimary,
          zIndex: 2001,
          padding: '8px',
        }}
      >
        <X size={32} />
      </button>

      {/* Navigation arrows */}
      <button
        onClick={() => onNavigate('prev')}
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: TOKENS.textPrimary,
          zIndex: 2001,
          padding: '8px',
        }}
      >
        <ChevronLeft size={48} />
      </button>
      <button
        onClick={() => onNavigate('next')}
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: TOKENS.textPrimary,
          zIndex: 2001,
          padding: '8px',
        }}
      >
        <ChevronRight size={48} />
      </button>

      {/* Image */}
      <img
        src={item.image}
        alt={item.vehicle}
        style={{
          maxHeight: '75vh',
          maxWidth: '85vw',
          objectFit: 'contain',
          borderRadius: '8px',
          animation: 'lightboxImageIn 0.3s ease forwards',
        }}
      />

      {/* Info bar */}
      <div
        style={{
          marginTop: '24px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            backgroundColor: TOKENS.accentGold,
            color: TOKENS.bgVoid,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '4px 14px',
            borderRadius: '9999px',
            marginBottom: '8px',
          }}
        >
          {item.type}
        </span>
        <h3
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: '1.25rem',
            color: TOKENS.textPrimary,
            textTransform: 'uppercase',
            margin: '4px 0',
          }}
        >
          {item.vehicle}
        </h3>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '0.875rem',
              color: TOKENS.textMuted,
            }}
          >
            {item.customer}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '0.875rem',
              color: TOKENS.textMuted,
            }}
          >
            <Heart size={14} /> {item.likes}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes lightboxIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lightboxImageIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

/* ─────────────────────── Section 4: Submit Your Plate ─────────────────────── */
function SubmitSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    if (leftRef.current) {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }
    if (rightRef.current) {
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'expo.out',
          delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }
  }, { scope: sectionRef })

  const [formData, setFormData] = useState({
    name: '',
    vehicle: '',
    plateType: '',
    social: '',
  })

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: TOKENS.bgSurface,
        padding: '120px 0',
      }}
    >
      <Container
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          maxWidth: '1200px',
          alignItems: 'start',
        }}
        className="submit-grid"
      >
        {/* Left — Text */}
        <div ref={leftRef} style={{ opacity: 0 }}>
          <Overline text="JOIN THE GALLERY" />
          <h2
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              letterSpacing: '-1.5px',
              lineHeight: 1,
              color: TOKENS.textPrimary,
              textTransform: 'uppercase',
            }}
          >
            SHOW US
            <br />
            <span style={{ color: TOKENS.accentGold }}>YOUR BUILD.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '1rem',
              color: TOKENS.textMuted,
              maxWidth: '480px',
              lineHeight: 1.6,
              marginTop: '20px',
            }}
          >
            Had your APEX plate installed? Share it with the community. The best
            submissions get featured on our homepage and social channels.
          </p>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '1rem',
              color: TOKENS.accentGold,
              marginTop: '16px',
            }}
          >
            &#10022; Featured submissions receive a &pound;20 discount on their next
            order.
          </p>
        </div>

        {/* Right — Upload Form */}
        <div ref={rightRef} style={{ opacity: 0 }}>
          {/* Upload Zone */}
          <div
            style={{
              border: `2px dashed ${TOKENS.borderSubtle}`,
              padding: '60px 24px',
              borderRadius: '8px',
              textAlign: 'center',
              transition: `all 0.3s ${easeSmooth}`,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = TOKENS.accentGold
              e.currentTarget.style.backgroundColor = TOKENS.accentGoldGlow
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = TOKENS.borderSubtle
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <Camera
              size={40}
              color={TOKENS.textMuted}
              style={{ margin: '0 auto 12px' }}
            />
            <h3
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: '1.125rem',
                color: TOKENS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '-0.5px',
              }}
            >
              DRAG &amp; DROP YOUR PHOTO
            </h3>
            <p
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.8rem',
                color: TOKENS.textMuted,
                marginTop: '8px',
              }}
            >
              Or click to browse — JPG, PNG up to 10MB
            </p>
          </div>

          {/* Fields */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginTop: '24px',
            }}
          >
            <FormField
              label="YOUR NAME"
              placeholder="e.g. James Smith"
              value={formData.name}
              onChange={(v) => setFormData((p) => ({ ...p, name: v }))}
            />
            <FormField
              label="VEHICLE MODEL"
              placeholder="e.g. BMW M4"
              value={formData.vehicle}
              onChange={(v) => setFormData((p) => ({ ...p, vehicle: v }))}
            />
            <FormSelect
              label="PLATE TYPE"
              value={formData.plateType}
              onChange={(v) => setFormData((p) => ({ ...p, plateType: v }))}
              options={PLATE_TYPES}
            />
            <FormField
              label="SOCIAL HANDLE (OPTIONAL)"
              placeholder="@instagram"
              value={formData.social}
              onChange={(v) => setFormData((p) => ({ ...p, social: v }))}
            />

            <button
              style={{
                width: '100%',
                padding: '16px 32px',
                borderRadius: '9999px',
                backgroundColor: TOKENS.accentGold,
                color: TOKENS.bgVoid,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '-0.72px',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                transition: `all 0.3s ${easeSmooth}`,
                marginTop: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 0 40px ${TOKENS.accentGoldGlow}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              SUBMIT TO GALLERY
            </button>
          </div>
        </div>
      </Container>

      <style>{`
        @media (max-width: 767px) {
          .submit-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          color: TOKENS.textMuted,
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}
      >
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: TOKENS.bgVoid,
          border: `1px solid ${TOKENS.borderSubtle}`,
          borderRadius: '6px',
          color: TOKENS.textPrimary,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.875rem',
          outline: 'none',
          transition: `border-color 0.3s ${easeSmooth}`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = TOKENS.accentGold
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = TOKENS.borderSubtle
        }}
      />
    </div>
  )
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          color: TOKENS.textMuted,
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: TOKENS.bgVoid,
          border: `1px solid ${TOKENS.borderSubtle}`,
          borderRadius: '6px',
          color: TOKENS.textPrimary,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.875rem',
          outline: 'none',
          cursor: 'pointer',
          transition: `border-color 0.3s ${easeSmooth}`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = TOKENS.accentGold
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = TOKENS.borderSubtle
        }}
      >
        <option value="" disabled>
          Select plate type
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

/* ─────────────────────── Section 5: CTA Banner ─────────────────────── */
function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    gsap.fromTo(
      sectionRef.current.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      style={{
        backgroundColor: TOKENS.bgVoid,
        padding: '100px 24px',
        textAlign: 'center',
      }}
    >
      <div ref={sectionRef} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            letterSpacing: '-2.4px',
            lineHeight: 0.9,
            color: TOKENS.textPrimary,
            textTransform: 'uppercase',
          }}
        >
          READY FOR YOUR CLOSE-UP?
        </h1>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '1rem',
            color: TOKENS.textMuted,
            marginTop: '16px',
            lineHeight: 1.6,
          }}
        >
          Build your plate now and it could be our next featured installation.
        </p>
        <Link
          to="/product"
          style={{
            display: 'inline-block',
            marginTop: '32px',
            padding: '16px 32px',
            borderRadius: '9999px',
            backgroundColor: TOKENS.accentGold,
            color: TOKENS.bgVoid,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: '0.875rem',
            letterSpacing: '-0.72px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: `all 0.3s ${easeSmooth}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = `0 0 40px ${TOKENS.accentGoldGlow}`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          BUILD YOUR PLATE
        </Link>
      </div>
    </section>
  )
}

/* ─────────────────────── Main Gallery Page ─────────────────────── */
export default function Gallery() {
  const [activeTab, setActiveTab] = useState<Tab>('ALL')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filteredItems =
    activeTab === 'ALL'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => {
          if (activeTab === '4D GEL') return item.type === '4D GEL'
          if (activeTab === '3D') return item.type === '3D'
          if (activeTab === 'SHOW PLATES') return item.type === 'SHOW PLATES'
          if (activeTab === 'CARBON') return item.type === 'CARBON'
          if (activeTab === 'STICKER PLATES') return item.type === 'STICKER PLATES'
          if (activeTab === 'SIGNATURE') return item.type === 'SIGNATURE'
          return true
        })

  const openLightbox = (_item: GalleryItem, index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const navigateLightbox = (dir: 'prev' | 'next') => {
    setLightboxIndex((prev) => {
      if (dir === 'prev') return prev === 0 ? filteredItems.length - 1 : prev - 1
      return prev === filteredItems.length - 1 ? 0 : prev + 1
    })
  }

  return (
    <div style={{ backgroundColor: TOKENS.bgVoid }}>
      <GalleryHero />
      <FilterBar activeTab={activeTab} onTabChange={setActiveTab} />
      <MasonryGrid items={filteredItems} onItemClick={openLightbox} />
      <SubmitSection />
      <CTABanner />

      {lightboxOpen && (
        <Lightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
  )
}
