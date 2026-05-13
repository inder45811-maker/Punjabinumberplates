import { useState, useRef, forwardRef } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  Shield,
  CheckCircle,
  Award,
  AlertTriangle,
  FileText,
  Plus,
  X,
  Mail,
  Phone,
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

const GlassCard = forwardRef<HTMLDivElement, {
  children: React.ReactNode
  style?: React.CSSProperties
  borderColor?: string
  className?: string
}>(function GlassCard({
  children,
  style,
  borderColor,
  className,
}, ref) {
  return (
    <div
      ref={ref}
      className={className}
      style={{
        background: 'rgba(17, 17, 17, 0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${borderColor || 'rgba(255, 255, 255, 0.05)'}`,
        borderRadius: '8px',
        ...style,
      }}
    >
      {children}
    </div>
  )
})

/* ─────────────────────── Accordion ─────────────────────── */
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

/* ─────────────────────── Section 1: Hero ─────────────────────── */
function LegalHero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
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
          delay: 0.2,
        }
      )
    }
    if (badgesRef.current) {
      gsap.fromTo(
        badgesRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'expo.out',
          delay: 0.6,
        }
      )
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: TOKENS.bgVoid,
        overflow: 'hidden',
      }}
    >
      {/* Subtle animated grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${TOKENS.borderSubtle} 1px, transparent 1px),
            linear-gradient(90deg, ${TOKENS.borderSubtle} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.3,
          animation: 'gridMove 20s linear infinite',
        }}
      />

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>

      <Container
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div ref={textRef}>
          <Overline text="COMPLIANCE &amp; TRUST" />
          <h1
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              letterSpacing: '-2.4px',
              lineHeight: 0.9,
              color: TOKENS.textPrimary,
              textTransform: 'uppercase',
            }}
          >
            FULLY COMPLIANT.
            <br />
            <span style={{ color: TOKENS.accentGold }}>ZERO COMPROMISE.</span>
          </h1>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '1rem',
              color: TOKENS.textMuted,
              maxWidth: '600px',
              margin: '24px auto 0',
              lineHeight: 1.6,
            }}
          >
            Every road legal plate is manufactured to exact DVLA and BSI AU 145e
            standards.
          </p>
        </div>

        {/* Trust Badges */}
        <div
          ref={badgesRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginTop: '48px',
            flexWrap: 'wrap',
          }}
        >
          {[
            {
              icon: <Shield size={24} color={TOKENS.successGreen} />,
              text: 'BSI AU 145e',
            },
            {
              icon: <CheckCircle size={24} color={TOKENS.successGreen} />,
              text: 'DVLA REGISTERED',
            },
            {
              icon: <Award size={24} color={TOKENS.accentGold} />,
              text: '5-YEAR WARRANTY',
            },
          ].map((badge) => (
            <GlassCard
              key={badge.text}
              style={{
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {badge.icon}
              <span
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: TOKENS.textPrimary,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.5px',
                }}
              >
                {badge.text}
              </span>
            </GlassCard>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ─────────────────────── Section 2: Road Legal Compliance ─────────────────────── */
function RoadLegalSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    if (leftRef.current) {
      const items = leftRef.current.querySelectorAll('.check-item')
      gsap.fromTo(
        items,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )
    }
    if (rightRef.current) {
      const cards = rightRef.current.querySelectorAll('.doc-card')
      gsap.fromTo(
        cards,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )
    }
  }, { scope: sectionRef })

  const requirements = [
    'Characters must be 79mm tall',
    'Characters must be 50mm wide (except \'1\' and \'I\')',
    'Character stroke must be 14mm',
    'Space between characters must be 11mm',
    'Space between groups must be 33mm',
    'Side margins must be 11mm minimum',
    'Vertical margins must be 11mm minimum',
    'Must display British Standard number (BS AU 145e)',
    'Must display supplier name and postcode',
  ]

  const documents = [
    {
      title: 'V5C (Log Book)',
      desc: 'Vehicle registration certificate. Must be the most recent version.',
      status: 'REQUIRED',
      statusColor: TOKENS.alertRed,
    },
    {
      title: 'V5C/2 (New Keeper Supplement)',
      desc: 'For new vehicle keepers who have not yet received the full V5C.',
      status: 'ALTERNATIVE',
      statusColor: TOKENS.accentGold,
    },
    {
      title: 'V948 (Authority to Get a Number Plate)',
      desc: 'DVLA-issued form for authorized plate suppliers.',
      status: 'ALTERNATIVE',
      statusColor: TOKENS.accentGold,
    },
    {
      title: 'eV948 (Electronic Authority)',
      desc: 'Electronic version of the V948 form.',
      status: 'ALTERNATIVE',
      statusColor: TOKENS.accentGold,
    },
  ]

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: TOKENS.bgSurface, padding: '120px 0' }}
    >
      <Container>
        <Overline text="ROAD LEGAL PLATES" />
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
          DVLA REGULATIONS{' '}
          <span style={{ color: TOKENS.accentGold }}>/ EXPLAINED</span>
        </h2>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '1rem',
            color: TOKENS.textMuted,
            maxWidth: '700px',
            lineHeight: 1.6,
            marginTop: '16px',
          }}
        >
          All our road legal number plates are manufactured to comply with
          current UK legislation, including British Standard BS AU 145e and DVLA
          requirements.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            marginTop: '48px',
          }}
          className="legal-grid"
        >
          {/* Left — Requirements */}
          <GlassCard ref={leftRef as React.RefObject<HTMLDivElement>} style={{ padding: '32px' }}>
            <h3
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: '1.25rem',
                color: TOKENS.textPrimary,
                textTransform: 'uppercase',
                letterSpacing: '-0.72px',
                marginBottom: '24px',
              }}
            >
              LEGAL REQUIREMENTS
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {requirements.map((req, i) => (
                <li
                  key={i}
                  className="check-item"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: '0.9rem',
                    color: TOKENS.textPrimary,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: TOKENS.successGreen, flexShrink: 0 }}>&#10003;</span>
                  {req}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Right — Documents */}
          <div ref={rightRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <GlassCard style={{ padding: '32px' }}>
              <h3
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: TOKENS.textPrimary,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.72px',
                  marginBottom: '24px',
                }}
              >
                REQUIRED DOCUMENTS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {documents.map((doc) => (
                  <div
                    key={doc.title}
                    className="doc-card"
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      padding: '16px',
                      backgroundColor: TOKENS.bgVoid,
                      borderRadius: '6px',
                    }}
                  >
                    <FileText
                      size={24}
                      color={TOKENS.accentGold}
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: TOKENS.textPrimary,
                            textTransform: 'uppercase',
                          }}
                        >
                          {doc.title}
                        </h4>
                        <span
                          style={{
                            padding: '2px 10px',
                            borderRadius: '9999px',
                            backgroundColor: doc.statusColor,
                            color: TOKENS.textPrimary,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {doc.status}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: "'Inter', system-ui, sans-serif",
                          fontSize: '0.85rem',
                          color: TOKENS.textMuted,
                          marginTop: '4px',
                          lineHeight: 1.5,
                        }}
                      >
                        {doc.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <Link
              to="/checkout"
              style={{
                display: 'inline-block',
                marginTop: '8px',
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
                textAlign: 'center',
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
              UPLOAD YOUR DOCUMENTS NOW
            </Link>
          </div>
        </div>
      </Container>

      <style>{`
        @media (max-width: 1023px) {
          .legal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

/* ─────────────────────── Section 3: Show Plate Terms ─────────────────────── */
function ShowPlateSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    const warning = sectionRef.current.querySelector('.warning-block')
    if (warning) {
      gsap.fromTo(
        warning,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )
    }
    const terms = sectionRef.current.querySelectorAll('.term-item')
    gsap.fromTo(
      terms,
      { opacity: 0, x: -10 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'expo.out',
        delay: 0.3,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      }
    )
  }, { scope: sectionRef })

  const warnings = [
    'Show plates are NOT DVLA compliant',
    'Show plates do NOT have legal markings',
    'Show plates are NOT for use on public roads',
    'Using a show plate on a public road is an offence',
    'Penalties can include fines up to \u00A31,000 and MOT failure',
  ]

  const acceptable = [
    'Car shows and exhibitions',
    'Photography and videography',
    'Private land and race tracks',
    'Garage and showroom display',
    'Social media content',
  ]

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: TOKENS.bgVoid, padding: '120px 0' }}
    >
      <Container>
        <Overline text="SHOW PLATES" color={TOKENS.alertRed} />
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
          DISPLAY ONLY.{" "}
          <span style={{ color: TOKENS.alertRed }}>/ NOT FOR ROAD USE.</span>
        </h2>
        <p
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '1rem',
            color: TOKENS.textMuted,
            maxWidth: '700px',
            lineHeight: 1.6,
            marginTop: '16px',
          }}
        >
          Show plates are custom number plates intended for off-road, display,
          show, or private land use only. By ordering a show plate, you
          acknowledge and accept the following terms.
        </p>

        {/* Warning Block */}
        <GlassCard
          borderColor={TOKENS.alertRed}
          className="warning-block"
          style={{ padding: '32px', marginTop: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <AlertTriangle size={32} color={TOKENS.alertRed} />
            <h3
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: '1.25rem',
                color: TOKENS.alertRed,
                textTransform: 'uppercase',
                letterSpacing: '-0.72px',
                margin: 0,
              }}
            >
              LEGAL NOTICE
            </h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {warnings.map((w, i) => (
              <li
                key={i}
                className="term-item"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.9rem',
                  color: TOKENS.textPrimary,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: TOKENS.alertRed, flexShrink: 0 }}>&#10007;</span>
                {w}
              </li>
            ))}
          </ul>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '0.95rem',
              color: TOKENS.alertRed,
              fontWeight: 500,
              marginTop: '20px',
              lineHeight: 1.5,
            }}
          >
            By purchasing a show plate, you confirm that you understand these
            plates are for display/off-road use only and will not be used on
            public highways.
          </p>
        </GlassCard>

        {/* Acceptable Use */}
        <GlassCard
          borderColor={TOKENS.successGreen}
          style={{ padding: '32px', marginTop: '32px' }}
        >
          <h3
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: '1.25rem',
              color: TOKENS.successGreen,
              textTransform: 'uppercase',
              letterSpacing: '-0.72px',
              marginBottom: '20px',
            }}
          >
            ACCEPTABLE USE
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {acceptable.map((a, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '0.9rem',
                  color: TOKENS.textPrimary,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: TOKENS.successGreen, flexShrink: 0 }}>&#10003;</span>
                {a}
              </li>
            ))}
          </ul>
        </GlassCard>
      </Container>
    </section>
  )
}

/* ─────────────────────── Section 4: Privacy & Data ─────────────────────── */
function PrivacySection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    const items = sectionRef.current.querySelectorAll('.accordion-wrapper')
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      }
    )
  }, { scope: sectionRef })

  const privacyItems = [
    {
      title: 'WHAT DATA DO WE COLLECT?',
      content:
        'We collect your name, address, email, phone number, vehicle registration, and uploaded DVLA documents solely for the purpose of manufacturing and delivering your number plates.',
    },
    {
      title: 'HOW LONG DO WE KEEP YOUR DATA?',
      content:
        'DVLA documents are deleted 30 days after your order is fulfilled. Personal data is retained for 7 years in compliance with UK tax regulations.',
    },
    {
      title: 'DO YOU SHARE MY DATA?',
      content:
        'We do not sell or share your personal data with third parties except where required by law or necessary for delivery (e.g., courier services).',
    },
  ]

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: TOKENS.bgSurface, padding: '100px 0' }}
    >
      <Container>
        <div className="accordion-wrapper">
          <Overline text="YOUR DATA" />
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
            PRIVACY <span style={{ color: TOKENS.accentGold }}>/ PROTECTION</span>
          </h2>
        </div>
        <div className="accordion-wrapper">
          <Accordion items={privacyItems} />
        </div>
      </Container>
    </section>
  )
}

/* ─────────────────────── Section 5: Terms of Service ─────────────────────── */
function TermsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return
    const sections = sectionRef.current.querySelectorAll('.terms-block')
    gsap.fromTo(
      sections,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      }
    )
  }, { scope: sectionRef })

  const terms = [
    {
      title: 'ORDERING',
      content:
        'All orders are subject to availability and acceptance. We reserve the right to refuse any order. Prices are inclusive of VAT at the current UK rate.',
    },
    {
      title: 'PRODUCTION TIME',
      content:
        'Road legal plates: 24-48 hours production time (subject to valid DVLA documents). Show plates: Same-day production for orders before 2PM.',
    },
    {
      title: 'DELIVERY',
      content:
        'Standard delivery: 3-5 working days, FREE. Express delivery: Next working day, \u00A36.99. International delivery available on request.',
    },
    {
      title: 'RETURNS',
      content:
        'Unused, unopened plates can be returned within 30 days for a full refund. Road legal plates cannot be returned once DVLA documents have been submitted for processing. Personalized/show plates cannot be returned unless defective.',
    },
    {
      title: 'WARRANTY',
      content:
        'All plates carry a 5-year warranty against manufacturing defects. This does not cover damage from improper fitting, accidents, or environmental factors.',
    },
  ]

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: TOKENS.bgVoid, padding: '100px 0' }}
    >
      <Container>
        <div className="terms-block">
          <Overline text="TERMS" />
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
            TERMS OF <span style={{ color: TOKENS.accentGold }}>/ SERVICE</span>
          </h2>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {terms.map((t, i) => (
            <div
              key={t.title}
              className="terms-block"
              style={{
                padding: '32px 0',
                borderBottom: `1px solid ${TOKENS.borderSubtle}`,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: TOKENS.textPrimary,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.5px',
                  marginBottom: '12px',
                }}
              >
                {i + 1}. {t.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: '1rem',
                  color: TOKENS.textMuted,
                  lineHeight: 1.6,
                }}
              >
                {t.content}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ─────────────────────── Section 6: Contact CTA ─────────────────────── */
function ContactCTA() {
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
      style={{ backgroundColor: TOKENS.bgSurface, padding: '100px 0' }}
    >
      <Container>
        <div
          ref={sectionRef}
          style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}
        >
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
            QUESTIONS?
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
            Our compliance team is available Monday to Friday, 9AM–5PM. We can
            guide you through the documentation process.
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
            <Link
              to="/contact"
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
              CONTACT US
            </Link>
            <Link
              to="/legal"
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
              VIEW FAQ
            </Link>
          </div>

          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="mailto:compliance@apexplates.co.uk"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.9rem',
                color: TOKENS.textMuted,
                textDecoration: 'none',
                transition: `color 0.3s ${easeSmooth}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = TOKENS.accentGold
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = TOKENS.textMuted
              }}
            >
              <Mail size={14} /> compliance@apexplates.co.uk
            </a>
            <a
              href="tel:02079460958"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '0.9rem',
                color: TOKENS.textMuted,
                textDecoration: 'none',
                transition: `color 0.3s ${easeSmooth}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = TOKENS.accentGold
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = TOKENS.textMuted
              }}
            >
              <Phone size={14} /> 020 7946 0958
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ─────────────────────── Main Legal Page ─────────────────────── */
export default function Legal() {
  return (
    <div style={{ backgroundColor: TOKENS.bgVoid }}>
      <LegalHero />
      <RoadLegalSection />
      <ShowPlateSection />
      <PrivacySection />
      <TermsSection />
      <ContactCTA />
    </div>
  )
}
