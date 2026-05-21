import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PlatePreview from '../components/PlatePreview3D'
import type { PlateStyle } from '../components/PlatePreview3D'
import { Star, Minus, Plus, MapPin, ClipboardList, Truck, RotateCcw, MessageCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ─── design tokens helpers ─── */
const c = {
  bgVoid: '#050401',
  bgSurface: '#111111',
  textPrimary: '#f2f3f4',
  textMuted: '#757575',
  accentGold: '#ffd700',
  accentGoldGlow: 'rgba(255, 215, 0, 0.15)',
  accentSienna: '#E09132',
  alertRed: '#d9534f',
  successGreen: '#4f8a4f',
  borderSubtle: '#222222',
}

const easeSmooth = 'cubic-bezier(0.23, 1, 0.32, 1)'

/* ─── card style helper ─── */
const cardStyle = {
  backgroundColor: '#0d0d0d',
  border: '1px solid #1e1e1e',
  borderRadius: '10px',
  padding: '20px',
  marginBottom: '16px',
}

/* ─── gallery images ─── */
const galleryImages = [
  '/keyrings/keyring-01.jpg', '/keyrings/keyring-02.jpg', '/keyrings/keyring-03.jpg', '/keyrings/keyring-04.jpg',
  '/keyrings/keyring-05.jpg', '/keyrings/keyring-06.jpg', '/keyrings/keyring-07.jpg', '/keyrings/keyring-08.jpg',
  '/keyrings/keyring-09.jpg', '/keyrings/keyring-10.jpg', '/keyrings/keyring-11.jpg', '/keyrings/keyring-12.jpg',
  '/keyrings/keyring-13.jpg', '/keyrings/keyring-14.jpg', '/keyrings/keyring-15.jpg', '/keyrings/keyring-16.jpg',
  '/keyrings/keyring-17.jpg', '/keyrings/keyring-18.jpg', '/keyrings/keyring-19.jpg', '/keyrings/keyring-20.jpg',
]

/* ─── reviews data ─── */
const reviews = [
  { name: 'Harpreet S', date: '2 weeks ago', text: 'Amazing quality keyring! Got my name JASWINDER on it and it looks exactly like a mini number plate. Perfect gift!', stars: 5 },
  { name: 'Gurpreet K', date: '1 month ago', text: 'Bought the double-sided keyring for my brother. The 4D gel finish is incredible, looks so premium. Fast delivery too!', stars: 5 },
  { name: 'Amritpal M', date: '2 months ago', text: 'These keyrings are sick! Got DOABA on mine with the chrome finish. All my mates want one now. Quality is top tier.', stars: 5 },
]

/* ─── related products data ─── */
const relatedProducts = [
  { id: 1, name: '4D 5MM ROAD LEGAL PLATES', price: '\u00A345.00', desc: 'Premium 4D 5mm plates. DVLA compliant.', image: '/pnp-07.jpg' },
  { id: 2, name: 'LUXURY PLATE HOLDER SURROUNDS', price: '\u00A385.00', desc: 'Custom side text plate holders with plates.', image: '/plate-holders/sandhu-holders.jpg' },
  { id: 3, name: '4D GEL ROAD LEGAL PLATES', price: '\u00A355.00', desc: 'Gloss black 4D gel finish.', image: '/pnp-05.jpg' },
  { id: 4, name: 'GHOST ROAD LEGAL PLATES', price: '\u00A370.00', desc: 'Stealth ghost plates with subtle characters.', image: '/pnp-06.jpg' },
]

/* ─── keyring type options ─── */
const keyringTypeOptions = [
  { key: 'single' as const, label: 'SINGLE-SIDED', desc: 'One side printed' },
  { key: 'double' as const, label: 'DOUBLE-SIDED', desc: 'Both sides printed' },
] as const

/* ─── style config (for selector cards) ─── */
const styleConfig = [
  { value: '4d-5mm' as const, label: '4D 5MM', price: '\u00A315', desc: 'Laser-cut acrylic' },
  { value: '4d-gel' as const, label: '4D GEL', price: '\u00A320', desc: 'Gloss gel resin' },
  { value: '3d-gel' as const, label: '3D GEL', price: '\u00A312', desc: 'Domed resin' },
  { value: 'ghost' as const, label: 'GHOST', price: '\u00A325', desc: 'Stealth subtle' },
]

/* ═══════════════════════════════════════════
   Keyrings Product Page
   ═══════════════════════════════════════════ */
export default function Keyrings() {
  /* ─── state ─── */
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.title = 'Keyrings \u2014 Punjabi Number Plates'
  }, [])

  const [activeImage, setActiveImage] = useState(0)
  const [regInput, setRegInput] = useState('')
  const [keyringStyle, setKeyringStyle] = useState<PlateStyle>('4d-5mm')
  const [keyringType, setKeyringType] = useState<'single' | 'double'>('single')
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'delivery'>('info')

  /* ─── computed price ─── */
  const stylePrices: Record<PlateStyle, number> = {
    '4d-5mm': 15,
    '4d-gel': 20,
    '3d-gel': 12,
    'ghost': 25,
  }
  const typeMultiplier = keyringType === 'double' ? 2 : 1
  const totalPrice = stylePrices[keyringStyle] * typeMultiplier * quantity

  /* ─── zoom state ─── */
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }, [])

  /* ─── refs ─── */
  const containerRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLElement>(null)
  const reviewsRef = useRef<HTMLElement>(null)
  const relatedRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLElement>(null)
  const tabIndicatorRef = useRef<HTMLDivElement>(null)

  /* ─── sticky bar visibility ─── */
  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ─── GSAP entrance animations ─── */
  useGSAP(() => {
    if (!containerRef.current) return

    /* Details section (tabs) */
    if (detailsRef.current) {
      gsap.fromTo(
        detailsRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: detailsRef.current, start: 'top 80%' },
        }
      )
    }

    /* Reviews */
    if (reviewsRef.current) {
      gsap.fromTo(
        reviewsRef.current.querySelector('.reviews-stats'),
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: { trigger: reviewsRef.current, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        reviewsRef.current.querySelectorAll('.review-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: reviewsRef.current, start: 'top 75%' },
        }
      )
    }

    /* Related products */
    if (relatedRef.current) {
      gsap.fromTo(
        relatedRef.current.querySelectorAll('.related-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: relatedRef.current, start: 'top 80%' },
        }
      )
    }

    /* CTA Banner */
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current.querySelectorAll('.cta-animate'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
        }
      )
    }
  }, { scope: containerRef })

  /* ─── tab indicator animation ─── */
  const handleTabChange = (tab: 'info' | 'specs' | 'delivery', index: number) => {
    setActiveTab(tab)
    if (tabIndicatorRef.current) {
      gsap.to(tabIndicatorRef.current, {
        x: index * 100 + '%',
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  return (
    <div ref={containerRef} style={{ backgroundColor: c.bgVoid }}>
      {/* ═══════ Breadcrumb ═══════ */}
      <nav style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: c.textMuted, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <Link to="/" style={{ color: c.textMuted, textDecoration: 'none', transition: `color 0.2s ${easeSmooth}` }}
            onMouseEnter={(e) => { e.currentTarget.style.color = c.accentGold }}
            onMouseLeave={(e) => { e.currentTarget.style.color = c.textMuted }}>
            HOME
          </Link>
          <span>/</span>
          <Link to="/shop" style={{ color: c.textMuted, textDecoration: 'none', transition: `color 0.2s ${easeSmooth}` }}
            onMouseEnter={(e) => { e.currentTarget.style.color = c.accentGold }}
            onMouseLeave={(e) => { e.currentTarget.style.color = c.textMuted }}>
            SHOP
          </Link>
          <span>/</span>
          <span style={{ color: c.accentGold }}>NUMBER PLATE KEYRINGS</span>
        </div>
      </nav>

      {/* ═══════ Section 1: Gallery + Form ═══════ */}
      <section
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: 'calc(64px + 40px) 24px 80px',
        }}
      >
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: isMobile ? '24px' : '40px' }}
        >
          {/* ─── Gallery ─── */}
          <div style={{ minWidth: 0, maxWidth: '900px', margin: '0 auto', width: '100%' }}>
            {/* Main Image */}
            <div
              style={{
                aspectRatio: isMobile ? '4/3' : '16/10',
                maxHeight: isMobile ? '280px' : '520px',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                cursor: isMobile ? 'default' : 'crosshair',
                backgroundColor: c.bgSurface,
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img
                key={activeImage}
                src={galleryImages[activeImage]}
                alt="Number Plate Keyring"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: isHovering ? 'scale(1.5)' : 'scale(1)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transition: `transform 0.3s ${easeSmooth}`,
                }}
              />
            </div>

            {/* Thumbnail Strip */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {galleryImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: isMobile ? '56px' : '80px',
                    height: isMobile ? '56px' : '80px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: `1px solid ${i === activeImage ? c.accentGold : c.borderSubtle}`,
                    padding: 0,
                    cursor: 'pointer',
                    background: 'none',
                    flexShrink: 0,
                    transition: `border-color 0.3s ${easeSmooth}`,
                  }}
                >
                  <img
                    src={src}
                    alt={`View ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ─── Product Form ─── */}
          <div style={{ minWidth: 0, maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            {/* Overline */}
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.8rem',
                color: c.accentGold,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              MINI PLATE COLLECTION
            </p>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: isMobile ? '1.8rem' : '2.5rem',
                letterSpacing: '-1.5px',
                lineHeight: 1,
                color: c.textPrimary,
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              NUMBER PLATE KEYRINGS
            </h1>

            {/* Price */}
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '2rem',
                color: c.accentGold,
                letterSpacing: '-1px',
                lineHeight: 1,
              }}
            >
              &pound;{totalPrice.toFixed(2)}
            </p>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.875rem',
                color: c.textMuted,
                marginTop: '4px',
              }}
            >
              *Premium acrylic keyrings with number plate styling
            </p>

            {/* Social Proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
              <span style={{ color: c.accentGold, fontSize: '0.875rem' }}>&#10022;</span>
              <span style={{ color: c.textMuted, fontSize: '0.875rem' }}>
                <span style={{ animation: 'pulse-opacity 2s ease-in-out infinite' }}>24</span> people viewing this right now
              </span>
            </div>

            {/* ── Card 1: Registration + Preview ── */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: c.textPrimary,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  YOUR REGISTRATION
                </label>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.75rem',
                    color: c.textMuted,
                  }}
                >
                  {regInput.length}/10
                </span>
              </div>
              <input
                type="text"
                value={regInput}
                onChange={(e) => setRegInput(e.target.value.toUpperCase().slice(0, 10))}
                placeholder="ENTER REG"
                maxLength={10}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.5rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  backgroundColor: c.bgSurface,
                  border: `1px solid ${c.borderSubtle}`,
                  borderRadius: '8px',
                  color: c.textPrimary,
                  outline: 'none',
                  transition: `border-color 0.3s ${easeSmooth}, box-shadow 0.3s ${easeSmooth}`,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = c.accentGold
                  e.currentTarget.style.boxShadow = `0 0 20px ${c.accentGoldGlow}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = c.borderSubtle
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {/* Plate Preview */}
              <div style={{ marginTop: '16px' }}>
                <PlatePreview
                  registration={regInput || 'YOUR REG'}
                  plateStyle={keyringStyle}
                  showToggle={true}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: c.textMuted, marginTop: '8px' }}>
                Enter your custom text with the exact spacing you require.
              </p>
            </div>

            {/* ── Card 2: Keyring Type ── */}
            <div style={cardStyle}>
              <label
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: c.textPrimary,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                KEYRING TYPE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {keyringTypeOptions.map((opt) => (
                  <label
                    key={opt.key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '14px 12px',
                      backgroundColor: c.bgSurface,
                      border: `2px solid ${keyringType === opt.key ? c.accentGold : c.borderSubtle}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: `border-color 0.2s ${easeSmooth}, box-shadow 0.2s ${easeSmooth}`,
                      boxShadow: keyringType === opt.key ? `0 0 12px ${c.accentGoldGlow}` : 'none',
                    }}
                  >
                    <input
                      type="radio"
                      name="keyringType"
                      value={opt.key}
                      checked={keyringType === opt.key}
                      onChange={() => setKeyringType(opt.key)}
                      style={{ display: 'none' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: c.textPrimary, letterSpacing: '0.05em' }}>
                        {opt.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: c.textMuted }}>{opt.desc}</span>
                    {keyringType === opt.key && (
                      <div style={{ width: '100%', height: '2px', backgroundColor: c.accentGold, borderRadius: '1px', marginTop: '4px' }} />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* ── Card 3: Keyring Style ── */}
            <div style={cardStyle}>
              <label
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: c.textPrimary,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                KEYRING STYLE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {styleConfig.map((opt) => (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '14px 12px',
                      backgroundColor: c.bgSurface,
                      border: `2px solid ${keyringStyle === opt.value ? c.accentGold : c.borderSubtle}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: `border-color 0.2s ${easeSmooth}, box-shadow 0.2s ${easeSmooth}`,
                      boxShadow: keyringStyle === opt.value ? `0 0 12px ${c.accentGoldGlow}` : 'none',
                    }}
                  >
                    <input
                      type="radio"
                      name="keyringStyle"
                      value={opt.value}
                      checked={keyringStyle === opt.value}
                      onChange={() => setKeyringStyle(opt.value)}
                      style={{ display: 'none' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: c.textPrimary, letterSpacing: '0.05em' }}>
                        {opt.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: c.accentGold, fontFamily: "'JetBrains Mono', monospace" }}>
                        {opt.price}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: c.textMuted }}>{opt.desc}</span>
                    {keyringStyle === opt.value && (
                      <div style={{ width: '100%', height: '2px', backgroundColor: c.accentGold, borderRadius: '1px', marginTop: '4px' }} />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* ── Card 4: Notes ── */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: c.textPrimary,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  ADDITIONAL NOTES
                </label>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.75rem',
                    color: c.textMuted,
                  }}
                >
                  {notes.length}/200
                </span>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 200))}
                placeholder="Any special requests, bespoke designs, or additional information..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: c.bgSurface,
                  border: `1px solid ${c.borderSubtle}`,
                  borderRadius: '8px',
                  color: c.textPrimary,
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  outline: 'none',
                  transition: `border-color 0.3s ${easeSmooth}, box-shadow 0.3s ${easeSmooth}`,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = c.accentGold
                  e.currentTarget.style.boxShadow = `0 0 20px ${c.accentGoldGlow}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = c.borderSubtle
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* ── Card 5: Quantity + Payment + Buttons ── */}
            <div style={cardStyle}>
              {/* Quantity */}
              <label
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: c.textPrimary,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                QUANTITY
              </label>
              <div style={{ display: 'flex', border: `1px solid ${c.borderSubtle}`, borderRadius: '8px', overflow: 'hidden', width: 'fit-content' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: c.bgSurface,
                    color: c.textPrimary,
                    border: 'none',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    opacity: quantity <= 1 ? 0.3 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => quantity > 1 && (e.currentTarget.style.backgroundColor = c.borderSubtle)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.bgSurface)}
                >
                  <Minus size={16} />
                </button>
                <div
                  style={{
                    width: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: c.textPrimary,
                    borderLeft: `1px solid ${c.borderSubtle}`,
                    borderRight: `1px solid ${c.borderSubtle}`,
                  }}
                >
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: c.bgSurface,
                    color: c.textPrimary,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.borderSubtle)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = c.bgSurface)}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Payment Options */}
              <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <label
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: c.textPrimary,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  PAYMENT OPTIONS
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
                  {([
                    { label: 'PayPal', text: `3 payments of \u00A3${(totalPrice / 3).toFixed(2)}`, color: '#003087' },
                    { label: 'Clearpay', text: `4 payments of \u00A3${(totalPrice / 4).toFixed(2)}`, color: '#A855F7' },
                    { label: 'Klarna', text: `Pay in 30 days`, color: '#FFB3C7' },
                  ]).map((pay) => (
                    <div
                      key={pay.label}
                      style={{
                        padding: isMobile ? '8px 12px' : '12px 20px',
                        background: 'rgba(17, 17, 17, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: isMobile ? '0.7rem' : '0.8rem',
                        color: c.textMuted,
                        flex: isMobile ? '1 1 auto' : '0 1 auto',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                    >
                      <span style={{ color: pay.color, fontWeight: 700, fontSize: isMobile ? '0.7rem' : '0.75rem', flexShrink: 0 }}>{pay.label}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>&mdash; {pay.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    borderRadius: '9999px',
                    border: `1px solid ${c.accentGold}`,
                    background: 'transparent',
                    color: c.accentGold,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    letterSpacing: '-0.72px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: `border-color 0.3s ${easeSmooth}, color 0.3s ${easeSmooth}, background-color 0.3s ${easeSmooth}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = c.accentGold
                    e.currentTarget.style.color = c.bgVoid
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = c.accentGold
                  }}
                >
                  ADD TO REG BUILDER
                </button>

                <button
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    borderRadius: '9999px',
                    border: 'none',
                    backgroundColor: c.accentGold,
                    color: c.bgVoid,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    letterSpacing: '-0.72px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: `transform 0.3s ${easeSmooth}, box-shadow 0.3s ${easeSmooth}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 0 40px ${c.accentGoldGlow}`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  BUY IT NOW
                </button>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: 'rgba(255, 215, 0, 0.08)',
                    border: `1px solid ${c.accentGold}`,
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    color: c.accentGold,
                    fontWeight: 600,
                  }}
                >
                  <MapPin size={12} />
                  PICKUP IN-STORE?
                </div>
                <a
                  href="https://wa.me/447741234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: 'rgba(37, 211, 102, 0.1)',
                    border: '1px solid #25D366',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    color: '#25D366',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={12} />
                  WHATSAPP?
                </a>
              </div>
            </div>

            {/* Pickup Info */}
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={16} color={c.textMuted} style={{ flexShrink: 0, marginTop: '3px' }} />
              <p style={{ fontSize: '0.875rem', color: c.textMuted }}>
                Click &amp; Collect available at Punjabi Number Plates, London. Usually ready in 24 hours.{" "}
                <Link to="/contact" style={{ color: c.accentGold, textDecoration: 'none' }}>
                  View store information
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 2: Info Tabs ═══════ */}
      <section ref={detailsRef} style={{ padding: isMobile ? '40px 0' : '80px 0', backgroundColor: c.bgSurface }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
          {/* Tab Navigation */}
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: `1px solid ${c.borderSubtle}`, marginBottom: '48px', overflowX: 'auto' }}>
            {([
              { key: 'info' as const, label: 'PRODUCT INFORMATION' },
              { key: 'specs' as const, label: 'SPECIFICATIONS' },
              { key: 'delivery' as const, label: 'DELIVERY & RETURNS' },
            ]).map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key, index)}
                style={{
                  padding: isMobile ? '10px 8px' : '16px 32px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: isMobile ? '0.65rem' : '0.875rem',
                  letterSpacing: isMobile ? '0.05em' : '0.15em',
                  textTransform: 'uppercase',
                  color: activeTab === tab.key ? c.accentGold : c.textMuted,
                  transition: `color 0.3s ${easeSmooth}`,
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}
              >
                {tab.label}
              </button>
            ))}
            <div
              ref={tabIndicatorRef}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: `${100 / 3}%`,
                height: '2px',
                backgroundColor: c.accentGold,
              }}
            />
          </div>

          {/* Tab Content */}
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '0 8px' : '0' }}>
            {activeTab === 'info' && (
              <div style={{ animation: 'fade-in 0.3s ease forwards' }}>
                <p style={{ color: c.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
                  Carry your pride everywhere with our premium <strong style={{ color: c.textPrimary }}>Number Plate Keyrings</strong> from Punjabi Number Plates. Each keyring is precision-crafted to replicate the iconic look of your vehicle&apos;s registration plate in miniature form.
                </p>
                <p style={{ color: c.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
                  Our Mini Plate Collection features durable acrylic construction with your choice of finish &mdash; 4D 5MM, 4D Gel, 3D Gel, or Ghost styling. Choose single-sided or double-sided printing for maximum impact.
                </p>
                <p style={{ color: c.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
                  Perfect for car enthusiasts, personalised gifts, or showing off your family name, clan, or custom text. The keyrings feature a premium metal split ring and robust acrylic plate that withstands daily use.
                </p>
                <p style={{ color: c.textMuted, lineHeight: 1.8 }}>
                  Custom text up to 10 characters. Exact spacing and styling as per your requirements. Same-day production available for orders placed before 2pm.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ animation: 'fade-in 0.3s ease forwards' }}>
                {([
                  { label: 'DIMENSIONS', value: 'Approx. 55mm x 15mm' },
                  { label: 'MATERIAL', value: 'Premium Acrylic' },
                  { label: 'KEYRING TYPE', value: 'Metal Split Ring' },
                  { label: 'PRINTING', value: 'Single or Double-Sided' },
                  { label: 'FINISH OPTIONS', value: '4D 5MM, 4D Gel, 3D Gel, Ghost' },
                  { label: 'MAX CHARACTERS', value: '10 Characters' },
                  { label: 'PRODUCTION TIME', value: 'Same Day (Orders Before 2pm)' },
                  { label: 'WARRANTY', value: '1 Year' },
                ]).map((spec, i, arr) => (
                  <div
                    key={spec.label}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '24px',
                      padding: '16px 0',
                      borderBottom: i < arr.length - 1 ? `1px solid ${c.borderSubtle}` : 'none',
                    }}
                  >
                    <span style={{ color: c.textMuted }}>{spec.label}</span>
                    <span style={{ color: c.textPrimary, fontWeight: 500 }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'delivery' && (
              <div style={{ animation: 'fade-in 0.3s ease forwards' }}>
                {/* Timeline */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '12px' : '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
                  {([
                    { icon: ClipboardList, label: 'ORDER PLACED' },
                    { icon: null, label: 'PRODUCTION (24H)' },
                    { icon: Truck, label: 'DISPATCHED' },
                  ]).map((step, i, arr) => (
                    <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        {step.icon ? (
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `1px solid ${c.accentGold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.accentGold }}>
                            <step.icon size={20} />
                          </div>
                        ) : (
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `1px dashed ${c.accentGold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.accentGold }}>
                            <RotateCcw size={20} />
                          </div>
                        )}
                        <span style={{ fontSize: '0.75rem', color: c.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{step.label}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div style={{ width: '40px', borderTop: `1px dashed ${c.accentGold}`, marginTop: '-20px' }} />
                      )}
                    </div>
                  ))}
                </div>
                <p style={{ color: c.textMuted, textAlign: 'center', lineHeight: 1.6, fontSize: isMobile ? '0.85rem' : '1rem', padding: '0 16px' }}>
                  30-day return policy on all unused keyrings. Personalised keyrings cannot be returned once production has begun.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ Section 3: Reviews ═══════ */}
      <section ref={reviewsRef} style={{ padding: '80px 24px', backgroundColor: c.bgVoid }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          {/* Stats Bar */}
          <div
            className="reviews-stats"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '48px',
              marginBottom: '48px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Google logo icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#f2f3f4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#f2f3f4" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#f2f3f4" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#f2f3f4" />
              </svg>
              <h2
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: c.textPrimary,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.72px',
                }}
              >
                461 REVIEWS
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={c.accentGold} color={c.accentGold} />
              ))}
            </div>

            <p style={{ color: c.textMuted, fontSize: '0.875rem' }}>
              5.0 AVERAGE RATING
            </p>
          </div>

          {/* Review Cards */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {reviews.map((review, i) => (
              <div
                key={i}
                className="review-card"
                style={{
                  background: 'rgba(17, 17, 17, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '24px',
                  width: '380px',
                  maxWidth: '100%',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: c.bgVoid,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: c.accentGold,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: '0.875rem',
                    }}
                  >
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700, fontSize: '0.875rem', color: c.textPrimary }}>
                      {review.name}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: c.textMuted }}>{review.date}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                  {[...Array(review.stars)].map((_, j) => (
                    <Star key={j} size={14} fill={c.accentGold} color={c.accentGold} />
                  ))}
                </div>
                <p
                  style={{
                    color: c.textMuted,
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Review Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '40px' }}>
            <a
              href="https://maps.app.goo.gl/P5FN5jQfMAKv4tgy7"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', borderRadius: '9999px',
                border: `1px solid ${c.borderSubtle}`, backgroundColor: 'transparent', color: c.textPrimary,
                fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600,
                fontSize: '0.85rem', letterSpacing: '-0.24px', textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'border-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.accentGold; e.currentTarget.style.color = c.accentGold }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.borderSubtle; e.currentTarget.style.color = c.textPrimary }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              VIEW ALL REVIEWS ON GOOGLE
            </a>
            <a
              href="https://search.google.com/local/writereview?placeid=ChIJZaCmAKCbcEgRw_NK6nFc0pc"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', borderRadius: '9999px',
                border: `1px solid ${c.accentGold}`, backgroundColor: c.accentGold, color: c.bgVoid,
                fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                fontSize: '0.85rem', letterSpacing: '-0.24px', textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = c.accentGold }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = c.accentGold; e.currentTarget.style.color = c.bgVoid }}
            >
              <Star size={14} />
              WRITE A REVIEW
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ Section 4: Related Products ═══════ */}
      <section ref={relatedRef} style={{ padding: isMobile ? '40px 16px' : '0 24px 80px', backgroundColor: c.bgVoid }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              letterSpacing: '-1.5px',
              lineHeight: 1,
              color: c.textPrimary,
              textTransform: 'uppercase',
              marginBottom: '48px',
            }}
          >
            COMPLETE YOUR SETUP
          </h2>

          <div
            style={{ display: 'grid', gap: '24px', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)' }}
          >
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="related-card"
                style={{
                  background: 'rgba(17, 17, 17, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = c.accentGold
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
                <div style={{ padding: '16px' }}>
                  <h3
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: c.textPrimary,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.5px',
                      marginBottom: '4px',
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: c.accentGold,
                      fontSize: '0.875rem',
                      marginBottom: '8px',
                    }}
                  >
                    {product.price}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: c.textMuted, marginBottom: '12px', lineHeight: 1.5 }}>
                    {product.desc}
                  </p>
                  <button
                    style={{
                      width: '100%',
                      padding: '10px 20px',
                      borderRadius: '9999px',
                      border: `1px solid ${c.textMuted}`,
                      background: 'transparent',
                      color: c.textPrimary,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: `border-color 0.3s ${easeSmooth}, color 0.3s ${easeSmooth}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = c.accentGold
                      e.currentTarget.style.color = c.accentGold
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = c.textMuted
                      e.currentTarget.style.color = c.textPrimary
                    }}
                  >
                    ADD TO REG BUILDER
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Section 5: CTA Banner ═══════ */}
      <section
        ref={ctaRef}
        style={{
          padding: '120px 24px',
          background: 'linear-gradient(135deg, #111111 0%, #1a1500 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Pulsing background gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 60%)',
            animation: 'pulse-bg 4s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h1
            className="cta-animate"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              letterSpacing: '-2.4px',
              lineHeight: 0.9,
              color: c.textPrimary,
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            COMPLETE THE LOOK WITH PLATES?
          </h1>
          <p
            className="cta-animate"
            style={{ color: c.textMuted, lineHeight: 1.6, marginBottom: '32px' }}
          >
            Match your keyring to a full set of premium number plates. Same styles, same quality, same day service.
          </p>
          <Link
            className="cta-animate"
            to="/product"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              borderRadius: '9999px',
              backgroundColor: c.accentGold,
              color: c.bgVoid,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              textDecoration: 'none',
              letterSpacing: '-0.72px',
              transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 0 40px ${c.accentGoldGlow}`
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

      {/* ═══════ Sticky Bar ═══════ */}
      {showStickyBar && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'rgba(17, 17, 17, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: `1px solid ${c.borderSubtle}`,
            padding: '16px 24px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'slide-up 0.3s ease forwards',
          }}
        >
          <div
            style={{
              maxWidth: '1440px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: c.accentGold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                NUMBER PLATE KEYRINGS
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.25rem', color: c.textPrimary }}>
                &pound;{totalPrice.toFixed(2)}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: `1px solid ${c.textMuted}`,
                  background: 'transparent',
                  color: c.textPrimary,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: `border-color 0.3s ${easeSmooth}, color 0.3s ${easeSmooth}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = c.accentGold
                  e.currentTarget.style.color = c.accentGold
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = c.textMuted
                  e.currentTarget.style.color = c.textPrimary
                }}
              >
                ADD TO REG BUILDER
              </button>
              <button
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: c.accentGold,
                  color: c.bgVoid,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                BUY IT NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ CSS Keyframe Animations ═══════ */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-opacity {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes pulse-bg {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
