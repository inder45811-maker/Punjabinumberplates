import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Star,
  Facebook,
  Twitter,
  Link as LinkIcon,
  Check,
  X,
  Minus,
  Plus,
  ShoppingCart,
  MapPin,
  ClipboardList,
  Truck,
  RotateCcw,
  MessageCircle,
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

/* ─── gallery images ─── */
const galleryImages = [
  '/pnp-07.jpg',
  '/pnp-05.jpg',
  '/pnp-06.jpg',
  '/pnp-03.jpg',
  '/pnp-08.jpg',
  '/pnp-09.jpg',
]

/* ─── related products data ─── */
const relatedProducts = [
  { id: 1, name: '4D GEL ROAD LEGAL PLATES', price: '£55.00', desc: 'Premium 4D gel plates with gloss black finish. DVLA compliant.', image: '/pnp-05.jpg' },
  { id: 2, name: 'GHOST ROAD LEGAL PLATES', price: '£70.00', desc: 'Stealth ghost plates with subtle 4D characters.', image: '/pnp-06.jpg' },
  { id: 3, name: '3D GEL DOMED PLATES', price: '£35.00', desc: 'Classic 3D gel domed plates with resin finish.', image: '/pnp-03.jpg' },
  { id: 4, name: 'STANDARD NUMBER PLATES', price: '£25.00', desc: 'High-quality standard plates. Road legal and DVLA compliant.', image: '/pnp-01.jpg' },
]

/* ─── gallery images for teaser ─── */
const galleryTeaserImages = [
  { src: '/pnp-07.jpg', label: '4D 5MM GEL', aspect: '4/3' },
  { src: '/pnp-05.jpg', label: '4D GEL PLATE', aspect: '3/4' },
  { src: '/pnp-06.jpg', label: 'GHOST PLATE', aspect: '4/3' },
  { src: '/pnp-03.jpg', label: '3D GEL DOMED', aspect: '3/4' },
  { src: '/pnp-08.jpg', label: 'CUSTOM INSTALL', aspect: '4/3' },
  { src: '/pnp-09.jpg', label: 'PREMIUM FINISH', aspect: '3/4' },
]

/* ─── reviews data ─── */
const reviews = [
  { name: 'Giasa R', date: '2 weeks ago', text: 'Really nice shop! polite and helpfull the staff are amazing and so helpfull if you need number plates this is the place to go', stars: 5 },
  { name: "Alex O'Connor", date: '1 month ago', text: 'Amazing service! Very fast delivery of my plates, hundreds of options to pick from for anyone unsure on what to pick style wise', stars: 5 },
  { name: 'Mohammed Shahib', date: '1 month ago', text: 'Great service, quick turnaround, and top quality plates. Staff were friendly and helpful, highly recommend!', stars: 5 },
]

/* ═══════════════════════════════════════════
   Main Product Page
   ═══════════════════════════════════════════ */
export default function Product() {
  /* ─── state ─── */
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const [activeImage, setActiveImage] = useState(0)
  const [regInput, setRegInput] = useState('')
  const [plateConfig, setPlateConfig] = useState<'front_rear' | 'front_only' | 'rear_only'>('front_rear')
  const [plateType, setPlateType] = useState<'road_legal' | 'show_plate'>('road_legal')
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'delivery'>('info')

  /* ─── computed price ─── */
  const basePrice = 45.00
  const configDiscount = plateConfig === 'front_rear' ? 0 : 20
  const totalPrice = (basePrice - configDiscount) * quantity

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
  const guideRef = useRef<HTMLElement>(null)
  const relatedRef = useRef<HTMLElement>(null)
  const galleryTeaserRef = useRef<HTMLElement>(null)
  const reviewsRef = useRef<HTMLElement>(null)
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

    /* Details section */
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

    /* Guide section */
    if (guideRef.current) {
      gsap.fromTo(
        guideRef.current.querySelectorAll('.guide-card'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, stagger: 0.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: guideRef.current, start: 'top 80%' },
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

    /* Gallery teaser */
    if (galleryTeaserRef.current) {
      gsap.fromTo(
        galleryTeaserRef.current.querySelectorAll('.teaser-img'),
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, scale: 1, duration: 0.8, stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: galleryTeaserRef.current, start: 'top 80%' },
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
      {/* ═══════ Section 1: Product Hero ═══════ */}
      <section
        style={{
          paddingTop: 'calc(64px + 40px)',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        <div
          className="collection-grid"
          style={{ display: 'grid', gap: '48px', paddingTop: '48px', paddingBottom: '80px' }}
        >
          {/* ─── Left Column: Gallery ─── */}
          <div>
            {/* Main Image */}
            <div
              style={{
                aspectRatio: '1/1',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'crosshair',
                backgroundColor: c.bgSurface,
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img
                key={activeImage}
                src={galleryImages[activeImage]}
                alt="4D 5mm Road Legal Plate"
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
                    width: '80px',
                    height: '80px',
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

          {/* ─── Right Column: Product Form ─── */}
          <div style={{ position: 'sticky', top: '104px', alignSelf: 'start' }}>
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
              4D GEL COLLECTION
            </p>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '2.5rem',
                letterSpacing: '-1.5px',
                lineHeight: 1,
                color: c.textPrimary,
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              4D 5MM ROAD LEGAL PLATES
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
              *Includes 1 front and 1 rear plate
            </p>

            {/* Social Proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
              <span style={{ color: c.accentGold, fontSize: '0.875rem' }}>&#10022;</span>
              <span style={{ color: c.textMuted, fontSize: '0.875rem' }}>
                <span style={{ animation: 'pulse-opacity 2s ease-in-out infinite' }}>24</span> people viewing this right now
              </span>
            </div>

            <div style={{ height: '1px', backgroundColor: c.borderSubtle, margin: '24px 0' }} />

            {/* Registration Input */}
            <div style={{ marginBottom: '20px' }}>
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
              {/* Live preview */}
              {regInput && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px 16px',
                    backgroundColor: c.bgSurface,
                    border: `1px solid ${c.borderSubtle}`,
                    borderRadius: '8px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '1.25rem',
                    letterSpacing: '0.1em',
                    color: c.textPrimary,
                    textTransform: 'uppercase',
                  }}
                >
                  {regInput || 'YOUR REG'}
                </div>
              )}
              <p style={{ fontSize: '0.8rem', color: c.textMuted, marginTop: '8px' }}>
                Enter your vehicle&apos;s registration with the exact spacing you require.
              </p>
            </div>

            {/* Plate Configuration */}
            <div style={{ marginBottom: '20px' }}>
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
                PLATE CONFIGURATION
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {([
                  { value: 'front_rear' as const, label: 'FRONT & REAR', delta: '+£0.00' },
                  { value: 'front_only' as const, label: 'FRONT ONLY', delta: '+£-25.00' },
                  { value: 'rear_only' as const, label: 'REAR ONLY', delta: '+£-25.00' },
                ]).map((opt) => (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: c.bgSurface,
                      border: `1px solid ${plateConfig === opt.value ? c.accentGold : c.borderSubtle}`,
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
                        border: `2px solid ${plateConfig === opt.value ? c.accentGold : c.borderSubtle}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: `border-color 0.2s ${easeSmooth}`,
                      }}
                    >
                      {plateConfig === opt.value && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.accentGold }} />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="plateConfig"
                      value={opt.value}
                      checked={plateConfig === opt.value}
                      onChange={() => setPlateConfig(opt.value)}
                      style={{ display: 'none' }}
                    />
                    <span style={{ flex: 1, fontSize: '0.875rem', color: c.textPrimary, textTransform: 'uppercase' }}>
                      {opt.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.875rem',
                        color: opt.delta === '+£0.00' ? c.textMuted : c.accentSienna,
                      }}
                    >
                      {opt.delta}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Plate Type */}
            <div style={{ marginBottom: '20px' }}>
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
                      {opt.sublabel} {opt.value === 'road_legal' ? <Check size={12} style={{ display: 'inline' }} /> : <X size={12} style={{ display: 'inline' }} />}
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
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '20px' }}>
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

            {/* Quantity */}
            <div style={{ marginBottom: '20px' }}>
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
            </div>

            {/* Payment Options */}
            <div style={{ marginBottom: '20px' }}>
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
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {([
                  { label: 'PayPal', text: '3 payments of £' + (totalPrice / 3).toFixed(2), color: '#003087' },
                  { label: 'Clearpay', text: '4 payments of £' + (totalPrice / 4).toFixed(2), color: '#A855F7' },
                ]).map((pay) => (
                  <div
                    key={pay.label}
                    style={{
                      padding: '12px 20px',
                      background: 'rgba(17, 17, 17, 0.6)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8rem',
                      color: c.textMuted,
                    }}
                  >
                    <span style={{ color: pay.color, fontWeight: 700, fontSize: '0.75rem' }}>{pay.label}</span>
                    <span>&mdash; {pay.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <button
              style={{
                width: '100%',
                padding: '16px 32px',
                borderRadius: '9999px',
                border: `1px solid ${c.textMuted}`,
                background: 'transparent',
                color: c.textPrimary,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '-0.72px',
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
                marginTop: '12px',
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
              PROCEED TO CHECKOUT
            </button>

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

            {/* Social Share */}
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: c.textMuted, textTransform: 'uppercase' }}>Share:</span>
              {[Facebook, Twitter, MessageCircle].map((Icon, i) => (
                <button
                  key={i}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: c.textMuted,
                    padding: '4px',
                    transition: `color 0.2s ${easeSmooth}`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = c.accentGold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = c.textMuted)}
                >
                  <Icon size={20} />
                </button>
              ))}
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: c.textMuted,
                  padding: '4px',
                  transition: `color 0.2s ${easeSmooth}`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = c.accentGold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = c.textMuted)}
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
              >
                <LinkIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 2: Product Details Tabs ═══════ */}
      <section ref={detailsRef} style={{ padding: isMobile ? '40px 0' : '80px 0', backgroundColor: c.bgSurface }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
          {/* Tab Navigation */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', borderBottom: `1px solid ${c.borderSubtle}`, marginBottom: '48px', overflowX: 'auto' }}>
            {([
              { key: 'info' as const, label: 'PRODUCT INFORMATION' },
              { key: 'specs' as const, label: 'SPECIFICATIONS' },
              { key: 'delivery' as const, label: 'DELIVERY & RETURNS' },
            ]).map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key, i)}
                style={{
                  padding: isMobile ? '12px 16px' : '16px 32px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: isMobile ? '0.7rem' : '0.875rem',
                  letterSpacing: isMobile ? '0.08em' : '0.15em',
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
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {activeTab === 'info' && (
              <div style={{ animation: 'fade-in 0.3s ease forwards' }}>
                <p style={{ color: c.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
                  Upgrade your vehicle with Punjabi Number Plates Premium Plates.
                </p>
                <p style={{ color: c.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
                  This listing is for a <strong style={{ color: c.textPrimary }}>4D 5mm</strong> number plate from Punjabi Number Plates, available as either a fully compliant <strong style={{ color: c.textPrimary }}>Road Legal plate</strong> or a <strong style={{ color: c.textPrimary }}>4D 5mm Show Plate</strong> for display use.
                </p>
                <p style={{ color: c.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
                  Please ensure you select the correct plate type before ordering.
                </p>
                <p style={{ color: c.textMuted, lineHeight: 1.8 }}>
                  Number plate surrounds are not included and are available separately from our{' '}
                  <Link to="/product" style={{ color: c.accentGold }}>Signature Surrounds Collection</Link>.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ animation: 'fade-in 0.3s ease forwards' }}>
                {([
                  { label: 'MATERIAL', value: '4D Laser-Cut Gel Resin' },
                  { label: 'DEPTH', value: '5mm Raised Characters' },
                  { label: 'BACKING', value: 'Carbon Composite' },
                  { label: 'FINISH', value: 'UV-Cured Gloss' },
                  { label: 'COMPLIANCE', value: 'DVLA BSI AU 145e (Road Legal option)' },
                  { label: 'LIFESPAN', value: '5+ Years Warranty' },
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
                  {([
                    { icon: ClipboardList, label: 'ORDER PLACED' },
                    { icon: null, label: 'PRODUCTION (24H)' },
                    { icon: Truck, label: 'DISPATCHED' },
                  ]).map((step, i, arr) => (
                    <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
                  30-day return policy on all unused plates. Road legal plates cannot be returned once registration documents have been submitted.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ Section 3: Road Legal vs Show Plate Guide ═══════ */}
      <section ref={guideRef} style={{ padding: '100px 24px', backgroundColor: c.bgVoid }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8rem',
              color: c.accentGold,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            KNOW THE DIFFERENCE
          </p>
          <h2
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '2.5rem',
              letterSpacing: '-1.5px',
              lineHeight: 1,
              color: c.textPrimary,
              textTransform: 'uppercase',
              marginBottom: '48px',
            }}
          >
            ROAD LEGAL <span style={{ color: c.accentGold }}>/ VS SHOW PLATE</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
            {/* Road Legal Card */}
            <div
              className="guide-card"
              style={{
                background: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${c.successGreen}`,
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  backgroundColor: c.successGreen,
                  color: c.bgVoid,
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '16px',
                }}
              >
                DVLA COMPLIANT <Check size={12} style={{ display: 'inline' }} />
              </span>
              <h3
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: c.textPrimary,
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  letterSpacing: '-0.72px',
                }}
              >
                ROAD LEGAL PLATE
              </h3>
              <p style={{ color: c.textMuted, lineHeight: 1.6, marginBottom: '24px' }}>
                Fully compliant number plates manufactured to meet DVLA regulations and legal for use on UK public roads.
              </p>
              <Link
                to="/legal"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: `1px solid ${c.textMuted}`,
                  color: c.textPrimary,
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
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
                VIEW REQUIRED DOCUMENTS
              </Link>
            </div>

            {/* Show Plate Card */}
            <div
              className="guide-card"
              style={{
                background: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${c.alertRed}`,
                borderRadius: '8px',
                padding: '32px',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  backgroundColor: c.alertRed,
                  color: c.textPrimary,
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '16px',
                }}
              >
                DISPLAY ONLY <X size={12} style={{ display: 'inline' }} />
              </span>
              <h3
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: c.textPrimary,
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  letterSpacing: '-0.72px',
                }}
              >
                SHOW PLATE
              </h3>
              <p style={{ color: c.textMuted, lineHeight: 1.6, marginBottom: '16px' }}>
                Custom plates intended for off-road, display, show, or private land use only.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ color: c.textMuted, fontSize: '0.875rem' }}>&#10007; Not DVLA compliant</li>
                <li style={{ color: c.textMuted, fontSize: '0.875rem' }}>&#10007; No legal markings</li>
                <li style={{ color: c.textMuted, fontSize: '0.875rem' }}>&#10007; Not for use on public roads</li>
              </ul>
              <Link
                to="/legal"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: `1px solid ${c.textMuted}`,
                  color: c.textPrimary,
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
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
                VIEW FULL TERMS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Section 4: Related Products ═══════ */}
      <section ref={relatedRef} style={{ padding: '100px 24px', backgroundColor: c.bgSurface }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '2.5rem',
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

      {/* ═══════ Section 5: Gallery Teaser ═══════ */}
      <section ref={galleryTeaserRef} style={{ padding: '100px 24px', backgroundColor: c.bgVoid }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8rem',
              color: c.accentGold,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            INSTALLED BY REAL DRIVERS
          </p>
          <h2
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '2.5rem',
              letterSpacing: '-1.5px',
              lineHeight: 1,
              color: c.textPrimary,
              textTransform: 'uppercase',
              marginBottom: '48px',
            }}
          >
            THE GALLERY
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {galleryTeaserImages.map((img, i) => (
              <div
                key={i}
                className="teaser-img"
                style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: img.aspect,
                  cursor: 'pointer',
                }}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.8))',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '16px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                >
                  <h3 style={{ color: c.textPrimary, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase' }}>
                    {img.label}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/gallery"
            style={{
              display: 'inline-block',
              marginTop: '48px',
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
            VIEW FULL GALLERY
          </Link>
        </div>
      </section>

      {/* ═══════ Section 6: Google Reviews Strip ═══════ */}
      <section ref={reviewsRef} style={{ padding: '80px 24px', backgroundColor: c.bgSurface }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                1,081 REVIEWS
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill={c.accentGold} color={c.accentGold} />
              ))}
            </div>

            <p style={{ color: c.textMuted, fontSize: '0.875rem' }}>
              4.8 AVERAGE RATING
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
        </div>
      </section>

      {/* ═══════ Section 7: CTA Banner ═══════ */}
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
            READY TO UPGRADE?
          </h1>
          <p
            className="cta-animate"
            style={{ color: c.textMuted, lineHeight: 1.6, marginBottom: '32px' }}
          >
            Your registration deserves the PNP treatment. Same day service available.
          </p>
          <Link
            className="cta-animate"
            to="/checkout"
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
          <div className="cta-animate" style={{ marginTop: '16px' }}>
            <Link
              to="/"
              style={{ color: c.accentGold, fontSize: '0.875rem', textDecoration: 'none' }}
            >
              OR BROWSE ALL PLATES
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ Sticky Add-to-Cart Bar ═══════ */}
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
                4D 5MM ROAD LEGAL PLATES
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
              <Link
                to="/checkout"
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: c.accentGold,
                  color: c.bgVoid,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
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
                <ShoppingCart size={14} />
                BUY IT NOW
              </Link>
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
