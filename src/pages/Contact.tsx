import { useState, useRef, forwardRef } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  ArrowRight,
  Shield,
  Package,
  RotateCcw,
  Users,
  Instagram,
  Youtube,
  Plus,
  X,
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
}

const easeSmooth = 'cubic-bezier(0.23, 1, 0.32, 1)'

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

const GlassCard = forwardRef<HTMLDivElement, { children: React.ReactNode; style?: React.CSSProperties }>(function GlassCard({ children, style }, ref) {
  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(17, 17, 17, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        ...style,
      }}
    >
      {children}
    </div>
  )
})

/* ─────────────────────── Accordion (same as Legal) ─────────────────────── */
function Accordion({
  items,
}: {
  items: { title: string; content: string }[]
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            style={{
              borderBottom: `1px solid ${TOKENS.borderSubtle}`,
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: TOKENS.textPrimary,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.5px',
                  paddingRight: '16px',
                }}
              >
                {item.title}
              </span>
              <span
                style={{
                  color: TOKENS.textMuted,
                  flexShrink: 0,
                  transition: `transform 0.3s ${easeSmooth}`,
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
              >
                {isOpen ? <X size={20} /> : <Plus size={20} />}
              </span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? '300px' : '0',
                overflow: 'hidden',
                opacity: isOpen ? 1 : 0,
                transition: `all 0.4s ${easeSmooth}`,
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '1rem',
                  color: TOKENS.textMuted,
                  lineHeight: 1.6,
                  paddingBottom: '24px',
                }}
              >
                {item.content}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────── Form Field ─────────────────────── */
function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: '0.875rem',
          letterSpacing: '0.15em',
          color: TOKENS.textPrimary,
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '14px 16px',
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
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: '0.875rem',
          letterSpacing: '0.15em',
          color: TOKENS.textPrimary,
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '14px 16px',
          backgroundColor: TOKENS.bgVoid,
          border: `1px solid ${TOKENS.borderSubtle}`,
          borderRadius: '6px',
          color: value ? TOKENS.textPrimary : TOKENS.textMuted,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.875rem',
          outline: 'none',
          cursor: 'pointer',
          transition: `border-color 0.3s ${easeSmooth}`,
          appearance: 'none',
          WebkitAppearance: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = TOKENS.accentGold
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = TOKENS.borderSubtle
        }}
      >
        <option value="" disabled>
          Select subject
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

function FormTextarea({
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
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: '0.875rem',
          letterSpacing: '0.15em',
          color: TOKENS.textPrimary,
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}
      >
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        style={{
          width: '100%',
          minHeight: '160px',
          padding: '14px 16px',
          backgroundColor: TOKENS.bgVoid,
          border: `1px solid ${TOKENS.borderSubtle}`,
          borderRadius: '6px',
          color: TOKENS.textPrimary,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.875rem',
          outline: 'none',
          resize: 'vertical',
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

/* ─────────────────────── Section 1: Contact Hero ─────────────────────── */
function ContactHero() {
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
        stagger: 0.08,
        ease: 'expo.out',
        delay: 0.1,
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      style={{
        backgroundColor: TOKENS.bgVoid,
        padding: '120px 0 80px',
      }}
    >
      <Container>
        <div ref={sectionRef} style={{ maxWidth: '800px' }}>
          <Overline text="GET IN TOUCH" />
          <h1
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              letterSpacing: '-2.4px',
              lineHeight: 0.9,
              color: TOKENS.textPrimary,
              textTransform: 'uppercase',
            }}
          >
            LET&apos;S TALK
            <br />
            <span style={{ color: TOKENS.accentGold }}>PLATES.</span>
          </h1>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '1rem',
              color: TOKENS.textMuted,
              maxWidth: '600px',
              lineHeight: 1.6,
              marginTop: '24px',
            }}
          >
            Whether you need help choosing, have a question about compliance, or
            want to discuss a bulk order — we&apos;re here.
          </p>
        </div>
      </Container>
    </section>
  )
}

/* ─────────────────────── Section 2: Form + Store Info ─────────────────────── */
function ContactFormAndStore() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    if (leftRef.current) {
      const fields = leftRef.current.querySelectorAll('.form-field')
      gsap.fromTo(
        fields,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
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
          duration: 1.0,
          ease: 'expo.out',
          delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      )
    }
  }, { scope: sectionRef })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitState('sending')
    setTimeout(() => setSubmitState('sent'), 1500)
  }

  const now = new Date()
  const currentDay = now.getDay() // 0 = Sunday

  const hours = [
    { label: 'MONDAY \u2014 FRIDAY', time: '9:00 AM \u2013 6:00 PM', dayCheck: (d: number) => d >= 1 && d <= 5 },
    { label: 'SATURDAY', time: '10:00 AM \u2013 4:00 PM', dayCheck: (d: number) => d === 6 },
    { label: 'SUNDAY', time: 'CLOSED', dayCheck: (d: number) => d === 0 },
  ]

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: TOKENS.bgVoid,
        padding: '0 0 120px',
      }}
    >
      <Container
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: '48px',
          maxWidth: '1200px',
          alignItems: 'start',
        }}
        className="contact-grid"
      >
        {/* Left — Contact Form */}
        <div ref={leftRef}>
          <div className="form-field">
            <h2
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: '1.75rem',
                color: TOKENS.textPrimary,
                letterSpacing: '-1px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              SEND US A MESSAGE
            </h2>
            <p
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.875rem',
                color: TOKENS.textMuted,
              }}
            >
              We&apos;ll respond within 24 hours.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginTop: '32px',
            }}
          >
            <div className="form-field">
              <FormField
                label="YOUR NAME"
                placeholder="e.g. Alex O'Connor"
                value={formData.name}
                onChange={(v) => setFormData((p) => ({ ...p, name: v }))}
              />
            </div>
            <div className="form-field">
              <FormField
                label="EMAIL ADDRESS"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={(v) => setFormData((p) => ({ ...p, email: v }))}
                type="email"
              />
            </div>
            <div className="form-field">
              <FormField
                label="PHONE NUMBER (OPTIONAL)"
                placeholder="+44 7700 900000"
                value={formData.phone}
                onChange={(v) => setFormData((p) => ({ ...p, phone: v }))}
                type="tel"
              />
            </div>
            <div className="form-field">
              <FormSelect
                label="SUBJECT"
                value={formData.subject}
                onChange={(v) => setFormData((p) => ({ ...p, subject: v }))}
                options={[
                  'ORDER INQUIRY',
                  'DVLA DOCUMENTS',
                  'BULK ORDER',
                  'SHOW PLATE QUESTION',
                  'OTHER',
                ]}
              />
            </div>
            <div className="form-field">
              <FormTextarea
                label="YOUR MESSAGE"
                placeholder="Tell us how we can help..."
                value={formData.message}
                onChange={(v) => setFormData((p) => ({ ...p, message: v }))}
              />
            </div>

            <button
              type="submit"
              disabled={submitState === 'sending' || submitState === 'sent'}
              style={{
                width: '100%',
                padding: '16px 32px',
                borderRadius: '9999px',
                backgroundColor:
                  submitState === 'sent' ? TOKENS.successGreen : TOKENS.accentGold,
                color: TOKENS.bgVoid,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '-0.72px',
                textTransform: 'uppercase',
                border: 'none',
                cursor: submitState === 'idle' ? 'pointer' : 'default',
                transition: `all 0.3s ${easeSmooth}`,
                marginTop: '16px',
              }}
              onMouseEnter={(e) => {
                if (submitState === 'idle') {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 0 40px ${TOKENS.accentGoldGlow}`
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {submitState === 'idle' && 'SEND MESSAGE'}
              {submitState === 'sending' && 'SENDING...'}
              {submitState === 'sent' && '\u2713 MESSAGE SENT'}
            </button>
          </form>
        </div>

        {/* Right — Store Info */}
        <GlassCard
          ref={rightRef as React.RefObject<HTMLDivElement>}
          style={{
            padding: '32px',
            opacity: 0,
          }}
        >
          {/* Visit Us */}
          <h3
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: '1.125rem',
              color: TOKENS.textPrimary,
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              marginBottom: '16px',
            }}
          >
            VISIT OUR SHOWROOM
          </h3>
          <div
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '0.9rem',
              color: TOKENS.textMuted,
              lineHeight: 1.7,
            }}
          >
            <div>PUNJABI NUMBER PLATES</div>
            <div>Unit 7, PNP Industrial Estate</div>
            <div>47-49 Northern Road</div>
            <div>London, N7 9BG</div>
          </div>

          {/* Hours Table */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginTop: '16px',
            }}
          >
            {hours.map((h) => {
              const isToday = h.dayCheck(currentDay)
              return (
                <div
                  key={h.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    backgroundColor: isToday
                      ? TOKENS.accentGoldGlow
                      : 'transparent',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: '0.8rem',
                      color: TOKENS.textMuted,
                      textTransform: 'uppercase',
                    }}
                  >
                    {h.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.8rem',
                      color: TOKENS.textPrimary,
                    }}
                  >
                    {h.time}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Map Embed */}
          <div
            style={{
              marginTop: '16px',
              aspectRatio: '16/9',
              borderRadius: '8px',
              border: `1px solid ${TOKENS.borderSubtle}`,
              overflow: 'hidden',
              backgroundColor: TOKENS.bgVoid,
            }}
          >
            <iframe
              title="Apex Plates Showroom Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.5!2d-0.1133!3d51.5514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMzJzA1LjAiTiAwwrAwNic0Ny45Ilc!5e0!3m2!1sen!2suk!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)', minHeight: '100%' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Contact Details */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a
              href="mailto:hello@punjabinumberplates.co.uk"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.9rem',
                color: TOKENS.textPrimary,
                textDecoration: 'underline',
                transition: `color 0.3s ${easeSmooth}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = TOKENS.accentGold
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = TOKENS.textPrimary
              }}
            >
              &#9993; hello@punjabinumberplates.co.uk
            </a>
            <a
              href="tel:02079460958"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.9rem',
                color: TOKENS.textPrimary,
                textDecoration: 'none',
              }}
            >
              &#9742; 020 7946 0958
            </a>
            <a
              href="https://wa.me/447384088600"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.9rem',
                color: TOKENS.textPrimary,
                textDecoration: 'underline',
                transition: `color 0.3s ${easeSmooth}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = TOKENS.accentGold
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = TOKENS.textPrimary
              }}
            >
              &#128172; WhatsApp
            </a>
          </div>

          {/* Social Links */}
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              gap: '12px',
            }}
          >
            {[
              { icon: <Instagram size={24} />, label: 'Instagram' },
              { icon: <XIcon />, label: 'X' },
              { icon: <FacebookIcon />, label: 'Facebook' },
              { icon: <Youtube size={24} />, label: 'YouTube' },
              { icon: <TikTokIcon />, label: 'TikTok' },
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                style={{
                  color: TOKENS.textMuted,
                  transition: `color 0.2s ${easeSmooth}`,
                  display: 'flex',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = TOKENS.accentGold
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = TOKENS.textMuted
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </GlassCard>
      </Container>

      <style>{`
        @media (max-width: 1023px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

/* Custom social icons as SVG since lucide may not have them all */
function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l6.5 8L4 20h2l5.5-6.8L16 20h4l-7-8.7L18 4h-2l-5.2 6.5L8 4H4z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
    </svg>
  )
}

/* ─────────────────────── Section 3: Quick Links ─────────────────────── */
function QuickLinksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    const cards = sectionRef.current.querySelectorAll('.quick-link-card')
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      }
    )
  }, { scope: sectionRef })

  const links = [
    {
      icon: <Shield size={32} color={TOKENS.accentGold} />,
      title: 'DVLA Guide',
      desc: 'Everything you need to know about road legal requirements.',
      to: '/legal',
    },
    {
      icon: <Package size={32} color={TOKENS.accentGold} />,
      title: 'Order Tracking',
      desc: 'Track your order status and delivery.',
      to: '/checkout',
    },
    {
      icon: <RotateCcw size={32} color={TOKENS.accentGold} />,
      title: 'Returns & Warranty',
      desc: 'Our 30-day return policy and 5-year warranty.',
      to: '/legal',
    },
    {
      icon: <Users size={32} color={TOKENS.accentGold} />,
      title: 'Bulk Orders',
      desc: 'Discounted pricing for trade customers and fleets.',
      to: '/contact',
    },
  ]

  return (
    <section
      style={{ backgroundColor: TOKENS.bgSurface, padding: '80px 0' }}
    >
      <Container>
        <h2
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            letterSpacing: '-1.5px',
            color: TOKENS.textPrimary,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          QUICK SUPPORT
        </h2>
        <div
          ref={sectionRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            marginTop: '32px',
          }}
          className="quick-links-grid"
        >
          {links.map((link) => (
            <Link
              key={link.title}
              to={link.to}
              className="quick-link-card"
              style={{
                textDecoration: 'none',
                display: 'block',
              }}
            >
              <GlassCard
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  height: '100%',
                  transition: `all 0.3s ${easeSmooth}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  {link.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    color: TOKENS.textPrimary,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.5px',
                    marginBottom: '8px',
                  }}
                >
                  {link.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: '0.85rem',
                    color: TOKENS.textMuted,
                    lineHeight: 1.5,
                    marginBottom: '12px',
                  }}
                >
                  {link.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ArrowRight size={16} color={TOKENS.accentGold} />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </Container>

      <style>{`
        .quick-link-card:hover > div {
          transform: translateY(-4px);
          border-color: var(--accent-gold) !important;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
        }
        @media (max-width: 1023px) {
          .quick-links-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 767px) {
          .quick-links-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

/* ─────────────────────── Section 4: FAQ Accordion ─────────────────────── */
function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    const items = sectionRef.current.querySelectorAll('.faq-item')
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      }
    )
  }, { scope: sectionRef })

  const faqs = [
    {
      title: 'HOW LONG DOES PRODUCTION TAKE?',
      content:
        'Road legal plates are produced within 24-48 hours (subject to valid DVLA documents). Show plates ordered before 2PM are produced same-day.',
    },
    {
      title: 'WHAT DOCUMENTS DO I NEED FOR A ROAD LEGAL PLATE?',
      content:
        'You need one of the following: V5C (log book), V5C/2 (new keeper supplement), V948, or eV948. All documents must be current and in your name.',
    },
    {
      title: 'DO YOU OFFER NEXT-DAY DELIVERY?',
      content:
        'Yes. Express delivery is available for \u00A36.99 and guarantees next working day dispatch. Standard delivery is FREE and takes 3-5 working days.',
    },
    {
      title: 'CAN I RETURN MY PLATE?',
      content:
        'Unused, unopened plates can be returned within 30 days. Road legal plates cannot be returned once DVLA documents have been processed. Show plates are non-returnable unless defective.',
    },
    {
      title: "WHAT'S THE DIFFERENCE BETWEEN 4D AND 3D PLATES?",
      content:
        '4D plates have laser-cut gel resin characters with a precise, flat-top finish. 3D plates have domed, rounded characters. Both are available in road legal and show plate variants.',
    },
    {
      title: 'DO YOU SHIP INTERNATIONALLY?',
      content:
        'Yes, we ship to most countries. International shipping rates are calculated at checkout. Please note road legal plates are only valid for UK-registered vehicles.',
    },
  ]

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: TOKENS.bgVoid, padding: '100px 0' }}
    >
      <Container>
        <div className="faq-item">
          <Overline text="COMMON QUESTIONS" />
          <h2
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              letterSpacing: '-1.5px',
              lineHeight: 1,
              color: TOKENS.textPrimary,
              textTransform: 'uppercase',
              marginBottom: '48px',
            }}
          >
            FREQUENTLY ASKED
          </h2>
        </div>
        <div className="faq-item">
          <Accordion items={faqs} />
        </div>
      </Container>
    </section>
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
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      style={{
        padding: '120px 24px',
        background: 'linear-gradient(135deg, #111111 0%, #1a1500 100%)',
      }}
    >
      <div
        ref={sectionRef}
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Subtle gold radial pulse */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'goldPulse 4s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <style>{`
          @keyframes goldPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          }
        `}</style>

        <h1
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            letterSpacing: '-2.4px',
            lineHeight: 0.9,
            color: TOKENS.textPrimary,
            textTransform: 'uppercase',
          }}
        >
          VISIT US IN PERSON
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
          Nothing beats seeing our plates in the metal. Drop by our London
          showroom and speak to the team.
        </p>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '0.9rem',
            color: TOKENS.accentGold,
            marginTop: '16px',
            lineHeight: 1.6,
          }}
        >
          PUNJABI NUMBER PLATES, Unit 7, PNP Industrial Estate, 47-49 Northern Road,
          London N7 9BG
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '32px',
            flexWrap: 'wrap',
          }}
        >
          <a
            href="https://www.google.com/maps/search/?api=1&query=51.5514,-0.1133"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '16px 32px',
              borderRadius: '9999px',
              backgroundColor: TOKENS.accentGold,
              color: TOKENS.bgVoid,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: '0.8rem',
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
            GET DIRECTIONS
          </a>
          <a
            href="tel:02079460958"
            style={{
              padding: '16px 32px',
              borderRadius: '9999px',
              backgroundColor: 'transparent',
              color: TOKENS.textPrimary,
              border: `1px solid ${TOKENS.textMuted}`,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '-0.72px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: `all 0.3s ${easeSmooth}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = TOKENS.accentGold
              e.currentTarget.style.color = TOKENS.accentGold
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = TOKENS.textMuted
              e.currentTarget.style.color = TOKENS.textPrimary
            }}
          >
            CALL US
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── Main Contact Page ─────────────────────── */
export default function Contact() {
  return (
    <div style={{ backgroundColor: TOKENS.bgVoid }}>
      <ContactHero />
      <ContactFormAndStore />
      <QuickLinksSection />
      <FAQSection />
      <CTABanner />
    </div>
  )
}
