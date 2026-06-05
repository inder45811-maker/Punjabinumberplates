import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PlatePreview from '../components/PlatePreview3D'
import type { PlateStyle } from '../components/PlatePreview3D'
import { useCart } from '../context/CartContext'
import { HOLDER_VARIANTS, buildHolderAttributes } from '../lib/variantMap'
import {
  Star,
  Check,
  Minus,
  Plus,
  MapPin,
  ClipboardList,
  Truck,
  RotateCcw,
  Upload,
  FileCheck,
} from 'lucide-react'

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
  '/plate-holders/sandhu-holders.jpg',
  '/plate-holders/doaba-holders.jpg',
  '/plate-holders/bhandal-holders.jpg',
  '/plate-holders/bhandal-holders-2.jpg',
  '/plate-holders/bhandal-holders-3.jpg',
]

/* ─── reviews data ─── */
const reviews = [
  { name: 'Jagdeep S', date: '3 weeks ago', text: 'Absolutely love my plate holders! The custom SANDHU text on the side looks amazing. Premium quality and fits perfectly.', stars: 5 },
  { name: 'Harpreet B', date: '1 month ago', text: 'Got the pair with BHANDAL branding and Khanda symbols. Absolutely class product. Fast delivery too!', stars: 5 },
  { name: 'Manvir D', date: '2 months ago', text: 'Best plate holders I have ever bought. The DOABA styling with the M stripes looks sick on my motor. Highly recommend!', stars: 5 },
]

/* ─── related products data ─── */
const relatedProducts = [
  { id: 1, name: '4D 5MM ROAD LEGAL PLATES', price: '\u00A345.00', desc: 'Premium 4D 5mm plates. DVLA compliant.', image: '/pnp-07.jpg' },
  { id: 2, name: '4D GEL ROAD LEGAL PLATES', price: '\u00A355.00', desc: 'Gloss black 4D gel finish.', image: '/pnp-05.jpg' },
  { id: 3, name: 'GHOST ROAD LEGAL PLATES', price: '\u00A370.00', desc: 'Stealth ghost plates with subtle characters.', image: '/pnp-06.jpg' },
  { id: 4, name: '3D GEL DOMED PLATES', price: '\u00A335.00', desc: 'Classic 3D gel domed resin finish.', image: '/pnp-03.jpg' },
]

/* ─── badge styles ─── */
const badgeStyles = [
  { key: 'text_only', label: 'TEXT ONLY', desc: 'Clean text styling' },
  { key: 'khanda', label: 'KHANDA', desc: 'Sikh symbol emblem' },
  { key: 'm_stripes', label: 'M STRIPES', desc: 'Sport stripe design' },
  { key: 'map_outline', label: 'MAP OUTLINE', desc: 'Punjab map design' },
] as const

/* ─── holder quantity options ─── */
const holderQuantityOptions = [
  { key: 'single', label: '1x Holder (Single)', price: '\u00A345.00' },
  { key: 'pair', label: '2x Holders (Pair)', price: '\u00A385.00' },
] as const

/* ─── plate style config (for selector cards) ─── */
const styleConfig = [
  { value: '4d-5mm' as const, label: '4D 5MM', price: '\u00A345', desc: 'Laser-cut acrylic' },
  { value: '4d-gel' as const, label: '4D GEL', price: '\u00A355', desc: 'Gloss gel resin' },
  { value: '3d-gel' as const, label: '3D GEL', price: '\u00A335', desc: 'Domed resin' },
  { value: 'ghost' as const, label: 'GHOST', price: '\u00A370', desc: 'Stealth subtle' },
]

/* ═══════════════════════════════════════════
   Plate Holders Product Page
   ═══════════════════════════════════════════ */
export default function PlateHolders() {
  /* ─── state ─── */
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.title = 'Plate Holders \u2014 Punjabi Number Plates'
  }, [])

  const [activeImage, setActiveImage] = useState(0)
  const [regInput, setRegInput] = useState('')
  const [holderQuantity, setHolderQuantity] = useState<'single' | 'pair'>('pair')
  const [plateStyle, setPlateStyle] = useState<PlateStyle>('4d-5mm')
  const [plateType, setPlateType] = useState<'road_legal' | 'show_plate'>('road_legal')
  const [sideText, setSideText] = useState('')
  const [badgeStyle, setBadgeStyle] = useState<'text_only' | 'khanda' | 'm_stripes' | 'map_outline'>('text_only')
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'delivery'>('info')
  const [proofOfId, setProofOfId] = useState<File | null>(null)
  const [proofOfEntitlement, setProofOfEntitlement] = useState<File | null>(null)
  const { addToCart, openCart, setPendingDocuments } = useCart()

  /* ─── computed price ─── */
  const stylePrices: Record<PlateStyle, number> = {
    '4d-5mm': 45,
    '4d-gel': 55,
    '3d-gel': 35,
    'ghost': 70,
  }
  const holderBase = holderQuantity === 'single' ? 45 : 85
  const platePrice = stylePrices[plateStyle] * (holderQuantity === 'pair' ? 2 : 1)
  const totalPrice = (holderBase + platePrice) * quantity
  const holderVariantConfigured = Boolean(HOLDER_VARIANTS[plateStyle])

  /* ─── zoom state ─── */
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }, [])

  /* ─── add to cart ─── */
  const handleAddToCart = useCallback(async () => {
    const variantId = HOLDER_VARIANTS[plateStyle]
    if (!variantId) {
      alert('Custom plate holders are not yet available in the Shopify store. Please add the product to Shopify admin first.')
      return
    }
    await addToCart({
      merchandiseId: variantId,
      quantity,
      attributes: buildHolderAttributes(regInput, plateStyle, plateType, holderQuantity, badgeStyle, sideText, notes),
    })
  }, [addToCart, plateStyle, plateType, holderQuantity, badgeStyle, quantity, regInput, sideText, notes])

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
          <span style={{ color: c.accentGold }}>PLATE HOLDER SURROUNDS</span>
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
                alt="Plate Holder Surrounds"
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
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingBottom: '8px',
              }}
              className="hide-scrollbar"
            >
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
                    scrollSnapAlign: 'start',
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
              SIGNATURE SURROUNDS COLLECTION
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
              PLATE HOLDER SURROUNDS
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
              *Premium plate holder surrounds with custom plates included
            </p>

            {/* Social Proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
              <span style={{ color: c.accentGold, fontSize: '0.875rem' }}>&#10022;</span>
              <span style={{ color: c.textMuted, fontSize: '0.875rem' }}>
                <span style={{ animation: 'pulse-opacity 2s ease-in-out infinite' }}>18</span> people viewing this right now
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
                  plateStyle={plateStyle}
                  showToggle={true}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: c.textMuted, marginTop: '8px' }}>
                Enter your vehicle&apos;s registration with the exact spacing you require.
              </p>
            </div>

            {/* ── Card 2: Holder Quantity ── */}
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
                HOLDER QUANTITY
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {holderQuantityOptions.map((opt) => (
                  <label
                    key={opt.key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '14px 12px',
                      backgroundColor: c.bgSurface,
                      border: `2px solid ${holderQuantity === opt.key ? c.accentGold : c.borderSubtle}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: `border-color 0.2s ${easeSmooth}, box-shadow 0.2s ${easeSmooth}`,
                      boxShadow: holderQuantity === opt.key ? `0 0 12px ${c.accentGoldGlow}` : 'none',
                    }}
                  >
                    <input
                      type="radio"
                      name="holderQuantity"
                      value={opt.key}
                      checked={holderQuantity === opt.key}
                      onChange={() => setHolderQuantity(opt.key)}
                      style={{ display: 'none' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: c.textPrimary, letterSpacing: '0.05em' }}>
                        {opt.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: c.accentGold, fontFamily: "'JetBrains Mono', monospace" }}>
                      {opt.price}
                    </span>
                    {holderQuantity === opt.key && (
                      <div style={{ width: '100%', height: '2px', backgroundColor: c.accentGold, borderRadius: '1px', marginTop: '4px' }} />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* ── Card 3: Plate Style ── */}
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
                PLATE STYLE
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
                      border: `2px solid ${plateStyle === opt.value ? c.accentGold : c.borderSubtle}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: `border-color 0.2s ${easeSmooth}, box-shadow 0.2s ${easeSmooth}`,
                      boxShadow: plateStyle === opt.value ? `0 0 12px ${c.accentGoldGlow}` : 'none',
                    }}
                  >
                    <input
                      type="radio"
                      name="plateStyle"
                      value={opt.value}
                      checked={plateStyle === opt.value}
                      onChange={() => setPlateStyle(opt.value)}
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
                    {plateStyle === opt.value && (
                      <div style={{ width: '100%', height: '2px', backgroundColor: c.accentGold, borderRadius: '1px', marginTop: '4px' }} />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* ── Card 4: Holder Side Text ── */}
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
                  HOLDER SIDE TEXT
                </label>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.75rem',
                    color: c.textMuted,
                  }}
                >
                  {sideText.length}/15
                </span>
              </div>
              <input
                type="text"
                value={sideText}
                onChange={(e) => setSideText(e.target.value.toUpperCase().slice(0, 15))}
                placeholder="E.G. SANDHU, DOABA, BHANDAL"
                maxLength={15}
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.25rem',
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
              <p style={{ fontSize: '0.8rem', color: c.textMuted, marginTop: '8px' }}>
                Custom text printed on the side of your holder surround. Family name, clan, or any text you want.
              </p>
            </div>

            {/* ── Card 5: Holder Badge Style ── */}
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
                HOLDER BADGE STYLE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {badgeStyles.map((opt) => (
                  <label
                    key={opt.key}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '14px 12px',
                      backgroundColor: c.bgSurface,
                      border: `2px solid ${badgeStyle === opt.key ? c.accentGold : c.borderSubtle}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: `border-color 0.2s ${easeSmooth}, box-shadow 0.2s ${easeSmooth}`,
                      boxShadow: badgeStyle === opt.key ? `0 0 12px ${c.accentGoldGlow}` : 'none',
                    }}
                  >
                    <input
                      type="radio"
                      name="badgeStyle"
                      value={opt.key}
                      checked={badgeStyle === opt.key}
                      onChange={() => setBadgeStyle(opt.key)}
                      style={{ display: 'none' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: c.textPrimary, letterSpacing: '0.05em' }}>
                      {opt.label}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: c.textMuted }}>{opt.desc}</span>
                    {badgeStyle === opt.key && (
                      <div style={{ width: '100%', height: '2px', backgroundColor: c.accentGold, borderRadius: '1px', marginTop: '4px' }} />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* ── Card 6: Plate Type + Documents ── */}
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
                PLATE TYPE
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {([
                  { value: 'road_legal' as const, label: 'ROAD LEGAL', sublabel: 'DVLA Compliant', color: c.successGreen },
                  { value: 'show_plate' as const, label: 'SHOW PLATE', sublabel: 'Display Only', color: c.alertRed },
                ]).map((opt) => (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: c.bgSurface,
                      border: `1px solid ${plateType === opt.value ? c.accentGold : c.borderSubtle}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: `border-color 0.2s ${easeSmooth}`,
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${plateType === opt.value ? c.accentGold : c.borderSubtle}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {plateType === opt.value && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.accentGold }} />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="plateType"
                      value={opt.value}
                      checked={plateType === opt.value}
                      onChange={() => setPlateType(opt.value)}
                      style={{ display: 'none' }}
                    />
                    <span style={{ flex: 1, fontSize: '0.875rem', color: c.textPrimary, textTransform: 'uppercase' }}>
                      {opt.label}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: opt.color }}>
                      {opt.sublabel} {opt.value === 'road_legal' ? <Check size={12} style={{ display: 'inline' }} /> : null}
                    </span>
                  </label>
                ))}
              </div>

              {/* Show Plate Warning */}
              {plateType === 'show_plate' && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '16px',
                    background: 'rgba(17, 17, 17, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    borderLeft: `3px solid ${c.alertRed}`,
                    animation: 'slide-down 0.3s ease forwards',
                  }}
                >
                  <p style={{ color: c.alertRed, fontWeight: 700, marginBottom: '8px' }}>
                    &#9888; NOT DVLA COMPLIANT
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li style={{ fontSize: '0.875rem', color: c.textMuted }}>&#10007; No legal markings</li>
                    <li style={{ fontSize: '0.875rem', color: c.textMuted }}>&#10007; Not for use on public roads</li>
                  </ul>
                  <Link
                    to="/legal"
                    style={{ color: c.accentGold, fontSize: '0.8rem', marginTop: '8px', display: 'inline-block' }}
                  >
                    View full Show Plate information and terms
                  </Link>
                </div>
              )}

              {/* Document Upload — Road Legal Only */}
              {plateType === 'road_legal' && (
                <div style={{ marginTop: '16px' }}>
                  {/* View Required Documents Guide */}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert('Required Documents Guide:\n\nProof of Identification:\n- Driving Licence (photocard)\n- Passport\n- National ID Card\n- Birth Certificate\n\nProof of Entitlement:\n- V5C Vehicle Registration Certificate\n- V750 Certificate of Entitlement\n- V778 Retention Document\n- VE30 Vehicle Excise Refund\n- DVLA eV948 Certificate'); }}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 215, 0, 0.08)',
                      border: `1px dashed ${c.accentGold}`,
                      borderRadius: '8px',
                      color: c.accentGold,
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      textDecoration: 'none',
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginBottom: '16px',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.15)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.08)' }}
                  >
                    <FileCheck size={14} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                    View Required Documents Guide
                  </a>

                  {/* Proof of Identification */}
                  <div style={{ marginBottom: '12px' }}>
                    <label
                      style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: c.textPrimary,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Proof of Identification <span style={{ color: c.alertRed }}>*</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '24px 16px',
                        border: `2px dashed ${proofOfId ? c.successGreen : c.borderSubtle}`,
                        borderRadius: '8px',
                        backgroundColor: proofOfId ? 'rgba(79, 138, 79, 0.05)' : c.bgSurface,
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease, background-color 0.2s ease',
                      }}
                    >
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setProofOfId(file)
                          setPendingDocuments({
                            proofOfId: file,
                            proofOfEntitlement,
                          })
                        }}
                        style={{ display: 'none' }}
                      />
                      {proofOfId ? (
                        <>
                          <FileCheck size={24} style={{ color: c.successGreen }} />
                          <span style={{ fontSize: '0.8rem', color: c.successGreen, fontWeight: 600 }}>
                            {proofOfId.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload size={24} style={{ color: c.textMuted }} />
                          <span style={{ fontSize: '0.8rem', color: c.textMuted }}>
                            Upload 1x Proof of Identification
                          </span>
                          <span style={{ fontSize: '0.7rem', color: c.textMuted, opacity: 0.6 }}>
                            Accept .jpg, .png, .pdf
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Proof of Entitlement */}
                  <div style={{ marginBottom: '4px' }}>
                    <label
                      style={{
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: c.textPrimary,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Proof of Entitlement <span style={{ color: c.alertRed }}>*</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '24px 16px',
                        border: `2px dashed ${proofOfEntitlement ? c.successGreen : c.borderSubtle}`,
                        borderRadius: '8px',
                        backgroundColor: proofOfEntitlement ? 'rgba(79, 138, 79, 0.05)' : c.bgSurface,
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease, background-color 0.2s ease',
                      }}
                    >
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          setProofOfEntitlement(file)
                          setPendingDocuments({
                            proofOfId,
                            proofOfEntitlement: file,
                          })
                        }}
                        style={{ display: 'none' }}
                      />
                      {proofOfEntitlement ? (
                        <>
                          <FileCheck size={24} style={{ color: c.successGreen }} />
                          <span style={{ fontSize: '0.8rem', color: c.successGreen, fontWeight: 600 }}>
                            {proofOfEntitlement.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload size={24} style={{ color: c.textMuted }} />
                          <span style={{ fontSize: '0.8rem', color: c.textMuted }}>
                            Upload 1x Proof of Entitlement
                          </span>
                          <span style={{ fontSize: '0.7rem', color: c.textMuted, opacity: 0.6 }}>
                            Accept .jpg, .png, .pdf
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* ── Card 7: Notes ── */}
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

            {/* ── Card 8: Quantity + Payment + Buttons ── */}
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
                  onClick={handleAddToCart}
                  disabled={!holderVariantConfigured}
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    borderRadius: '9999px',
                    border: `1px solid ${holderVariantConfigured ? c.textMuted : c.borderSubtle}`,
                    background: 'transparent',
                    color: holderVariantConfigured ? c.textPrimary : c.textMuted,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    letterSpacing: '-0.72px',
                    textTransform: 'uppercase',
                    cursor: holderVariantConfigured ? 'pointer' : 'not-allowed',
                    opacity: holderVariantConfigured ? 1 : 0.6,
                    transition: `border-color 0.3s ${easeSmooth}, color 0.3s ${easeSmooth}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!holderVariantConfigured) return
                    e.currentTarget.style.borderColor = c.accentGold
                    e.currentTarget.style.color = c.accentGold
                  }}
                  onMouseLeave={(e) => {
                    if (!holderVariantConfigured) return
                    e.currentTarget.style.borderColor = c.textMuted
                    e.currentTarget.style.color = c.textPrimary
                  }}
                >
                  {holderVariantConfigured ? 'ADD TO CART' : 'COMING SOON'}
                </button>

                <button
                  onClick={openCart}
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
                  VIEW CART
                </button>
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
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', borderBottom: `1px solid ${c.borderSubtle}`, marginBottom: '48px', overflowX: 'auto' }}>
            {([
              { key: 'info' as const, label: 'PRODUCT INFORMATION' },
              { key: 'specs' as const, label: 'SPECIFICATIONS' },
              { key: 'delivery' as const, label: 'DELIVERY & RETURNS' },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key, tab.key === 'info' ? 0 : tab.key === 'specs' ? 1 : 2)}
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
                  borderBottom: activeTab === tab.key ? `1px solid ${c.accentGold}` : '1px solid transparent',
                  transition: `color 0.3s ${easeSmooth}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '0 8px' : '0' }}>
            {activeTab === 'info' && (
              <div style={{ animation: 'fade-in 0.3s ease forwards' }}>
                <p style={{ color: c.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
                  Elevate your vehicle&apos;s presence with our premium <strong style={{ color: c.textPrimary }}>Plate Holder Surrounds</strong> from Punjabi Number Plates. Each holder is custom-crafted with your choice of side text, badge styling, and a complete set of plates.
                </p>
                <p style={{ color: c.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
                  Our Signature Surrounds Collection features durable, high-gloss ABS frames with precision-fit plate mounting. Add your family name, clan, or custom message to the side for a truly personalised look.
                </p>
                <p style={{ color: c.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
                  Choose from four badge styles: clean text-only, the iconic <strong style={{ color: c.textPrimary }}>Khanda</strong> Sikh symbol, sporty <strong style={{ color: c.textPrimary }}>M Stripes</strong>, or a detailed <strong style={{ color: c.textPrimary }}>Punjab map outline</strong>.
                </p>
                <p style={{ color: c.textMuted, lineHeight: 1.8 }}>
                  Every holder set includes your choice of plate style &mdash; 4D 5MM, 4D Gel, 3D Gel, or Ghost plates &mdash; fully installed and ready to mount.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ animation: 'fade-in 0.3s ease forwards' }}>
                {([
                  { label: 'HOLDER MATERIAL', value: 'High-Gloss ABS Plastic' },
                  { label: 'FINISH', value: 'UV-Resistant Gloss Black' },
                  { label: 'PLATE MOUNTING', value: 'Precision Pre-Drilled' },
                  { label: 'SIDE TEXT', value: 'Up to 15 Characters Custom' },
                  { label: 'BADGE OPTIONS', value: 'Text, Khanda, M Stripes, Map' },
                  { label: 'INCLUDED PLATES', value: 'Your Choice of 4D/3D/Ghost' },
                  { label: 'FITMENT', value: 'Universal UK/EU Standard' },
                  { label: 'WARRANTY', value: '3 Years' },
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
                  30-day return policy on all unused plate holder sets. Road legal plates cannot be returned once registration documents have been submitted.
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
            className="gallery-grid"
            style={{ display: 'grid', gap: '24px' }}
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
                  <Link
                    to="/product"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 20px',
                      borderRadius: '9999px',
                      border: `1px solid ${c.textMuted}`,
                      background: 'transparent',
                      color: c.textPrimary,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      textAlign: 'center',
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
                    VIEW PRODUCT
                  </Link>
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
            READY TO UPGRADE YOUR PLATES?
          </h1>
          <p
            className="cta-animate"
            style={{ color: c.textMuted, lineHeight: 1.6, marginBottom: '32px' }}
          >
            Custom holder surrounds with your name, your clan, your style. Same day service available.
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
                PLATE HOLDER SURROUNDS
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.25rem', color: c.textPrimary }}>
                &pound;{totalPrice.toFixed(2)}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddToCart}
                disabled={!holderVariantConfigured}
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: `1px solid ${holderVariantConfigured ? c.textMuted : c.borderSubtle}`,
                  background: 'transparent',
                  color: holderVariantConfigured ? c.textPrimary : c.textMuted,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  cursor: holderVariantConfigured ? 'pointer' : 'not-allowed',
                  opacity: holderVariantConfigured ? 1 : 0.6,
                  transition: `border-color 0.3s ${easeSmooth}, color 0.3s ${easeSmooth}`,
                }}
                onMouseEnter={(e) => {
                  if (!holderVariantConfigured) return
                  e.currentTarget.style.borderColor = c.accentGold
                  e.currentTarget.style.color = c.accentGold
                }}
                onMouseLeave={(e) => {
                  if (!holderVariantConfigured) return
                  e.currentTarget.style.borderColor = c.textMuted
                  e.currentTarget.style.color = c.textPrimary
                }}
              >
                {holderVariantConfigured ? 'ADD TO CART' : 'COMING SOON'}
              </button>
              <button
                onClick={openCart}
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                VIEW CART
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
