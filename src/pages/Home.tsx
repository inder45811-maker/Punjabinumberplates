import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, ArrowRight } from 'lucide-react'
import Marquee from 'react-fast-marquee'
import { useScrollReveal } from '../hooks/useScrollReveal'

gsap.registerPlugin(ScrollTrigger)

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */
const reviews = [
  { author: 'Giasa Rs', date: '2024-12', rating: 5, text: 'Really nice shop! polite and helpfull the staff are amazing (Kash) and so helpfull if you need number plates this is the place to go' },
  { author: "Alex O'Connor", date: '2024-11', rating: 5, text: 'Amazing service! Very fast delivery of my plates, hundreds of options to pick from for anyone unsure on what pick style wise for there reg plate, would highly recommend!!!!' },
  { author: 'Jon Jack', date: '2024-11', rating: 5, text: 'Very helpful kas sorted me out with two jap style plates and was in and out on 30 mins and turned out perfect thank you very much' },
  { author: 'Nikki Mole', date: '2024-10', rating: 5, text: 'Was recommended yourselves by my brother, great service, so many options and nice shop presentation.. thanks guys!' },
  { author: 'Mohammed Shahib', date: '2024-10', rating: 5, text: 'Great service, quick turnaround, and top quality plates. Staff were friendly and helpful, highly recommend!' },
  { author: 'Sarah L.', date: '2024-09', rating: 5, text: 'Absolutely stunning plates! The 4D gel finish is incredible. Professional fitting and outstanding customer service. Will be back for my other car.' },
]

const products = [
  { name: '4D 5MM ROAD LEGAL PLATES', price: '\u00a345.00', img: '/pnp-07.jpg' },
  { name: '4D GEL ROAD LEGAL PLATES', price: '\u00a355.00', img: '/pnp-05.jpg' },
  { name: 'GHOST ROAD LEGAL PLATES', price: '\u00a370.00', img: '/pnp-06.jpg' },
  { name: 'STANDARD NUMBER PLATES', price: '\u00a325.00', img: '/pnp-01.jpg' },
]

const galleryImages = [
  { src: '/pnp-07.jpg', label: '4D 5MM GEL BLACK' },
  { src: '/pnp-05.jpg', label: '4D GEL ROAD LEGAL' },
  { src: '/pnp-06.jpg', label: 'GHOST PLATES' },
  { src: '/pnp-03.jpg', label: '3D GEL DOMED' },
  { src: '/pnp-08.jpg', label: 'CUSTOM INSTALL' },
  { src: '/pnp-09.jpg', label: 'PREMIUM FINISH' },
  { src: '/pnp-10.jpg', label: '4D LASER CUT' },
  { src: '/pnp-11.jpg', label: 'SHOW PLATES' },
]

const stats = [
  { number: '500+', label: 'INSTALLATIONS' },
  { number: '50+', label: 'VEHICLE BRANDS' },
  { number: '5\u2605', label: 'AVERAGE RATING' },
]

export default function Home() {
  return (
    <div style={{ backgroundColor: '#050401' }}>
      <HeroSection />
      <TrustedBySection />
      <CollectionSection />
      <CraftSection />
      <GalleryPreviewSection />
      <ReviewsSection />
      <ContactCTASection />
    </div>
  )
}

/* ═══════════════════════════════════════════════
   SECTION 2: HERO
   ═══════════════════════════════════════════════ */
function HeroSection() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    const img = imgRef.current
    if (!section || !text || !img) return

    const ctx = gsap.context(() => {
      gsap.from(text.children, {
        y: 40,
        opacity: 0,
        duration: 1.0,
        stagger: 0.08,
        ease: 'expo.out',
        delay: 0.5,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: isMobile ? '85vh' : '100vh',
        overflow: 'hidden',
        backgroundColor: '#050401',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Single background image with gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}>
        <img
          ref={imgRef}
          src="/pnp-07.jpg"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6,
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(5,4,1,0.7) 0%, rgba(5,4,1,0.4) 40%, rgba(5,4,1,0.8) 100%)',
        }} />
      </div>

      {/* Content */}
      <div
        ref={textRef}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '120px 20px 40px' : '100px 24px',
          textAlign: 'center',
          maxWidth: '800px',
        }}
      >
        <h1
          className="hero-line-1"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: isMobile ? '2.5rem' : 'clamp(3.5rem, 7vw, 7rem)',
            letterSpacing: isMobile ? '-1px' : '-2.4px',
            color: '#f2f3f4',
            textTransform: 'uppercase',
            lineHeight: 1.0,
            textAlign: 'center',
            marginBottom: '4px',
            wordBreak: 'keep-all',
          }}
        >
          YOUR REG,
        </h1>
        <h1
          className="hero-line-2"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: isMobile ? '2.5rem' : 'clamp(3.5rem, 7vw, 7rem)',
            letterSpacing: isMobile ? '-1px' : '-2.4px',
            color: '#ffd700',
            textTransform: 'uppercase',
            lineHeight: 1.0,
            textAlign: 'center',
            marginBottom: '24px',
            wordBreak: 'keep-all',
          }}
        >
          YOUR RULE.
        </h1>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: isMobile ? '0.9rem' : '1.1rem',
            color: '#a0a0a0',
            maxWidth: '480px',
            textAlign: 'center',
            lineHeight: 1.5,
            marginBottom: '24px',
          }}
        >
          Handcrafted number plates. Same day service. Road legal, show plates, and everything in between.
        </p>
        <Link
          to="/product"
          style={{
            padding: isMobile ? '14px 28px' : '16px 36px',
            borderRadius: '9999px',
            backgroundColor: '#ffd700',
            color: '#050401',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: isMobile ? '0.85rem' : '1rem',
            letterSpacing: '-0.5px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          BROWSE COLLECTION
        </Link>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   SECTION 3: TRUSTED BY THOUSANDS
   ═══════════════════════════════════════════════ */
function TrustedBySection() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const statsRef = useScrollReveal<HTMLDivElement>({
    y: 40, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 85%', children: true, stagger: 0.2,
  })
  const headerRef = useScrollReveal<HTMLDivElement>({
    y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', start: 'top 85%',
  })

  return (
    <section style={{ padding: isMobile ? '60px 0' : '100px 0', backgroundColor: '#050401' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', letterSpacing: '0.2em',
            color: '#757575', textTransform: 'uppercase',
          }}>
            TRUSTED BY THOUSANDS
          </p>
        </div>

        <Marquee speed={40} gradient={false}>
          {[
            'SAME DAY SERVICE', 'DVLA APPROVED SUPPLIERS', 'NEXT-DAY DELIVERY', 'PREMIUM MATERIALS',
            'SAME DAY SERVICE', 'DVLA APPROVED SUPPLIERS', 'NEXT-DAY DELIVERY', 'PREMIUM MATERIALS',
          ].map((item, i) => (
            <span key={i} style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#757575',
              padding: '0 32px', display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span style={{ color: '#ffd700', fontSize: '0.6rem' }}>&#9670;</span>
              {item}
            </span>
          ))}
        </Marquee>

        <div ref={statsRef} className="stats-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '80px',
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-1.5px',
                color: '#ffd700', lineHeight: 1, marginBottom: '8px',
              }}>
                {stat.number}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
                letterSpacing: '0.15em', color: '#757575', textTransform: 'uppercase',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   SECTION 4: THE COLLECTION
   ═══════════════════════════════════════════════ */
function CollectionSection() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const leftRef = useScrollReveal<HTMLDivElement>({
    x: -40, y: 0, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 80%',
  })
  const rightRef = useScrollReveal<HTMLDivElement>({
    y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'expo.out', start: 'top 80%',
  })

  return (
    <section style={{ padding: isMobile ? '60px 0' : '120px 0', backgroundColor: '#050401' }}>
      <div className="collection-grid" style={{
        maxWidth: '1440px', margin: '0 auto', padding: '0 24px',
        display: 'grid', gap: '24px', alignItems: 'start',
      }}>
        {/* Left: Featured Image */}
        <div ref={leftRef}>
          <div
            style={{
              position: 'relative', aspectRatio: '3/4', borderRadius: '8px',
              overflow: 'hidden', border: '1px solid #222222',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.05)'
              const img = e.currentTarget.querySelector('img')
              if (img) (img as HTMLElement).style.transform = 'scale(1.05)'
              const btn = e.currentTarget.querySelector('.quick-view') as HTMLElement
              if (btn) btn.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#222222'
              e.currentTarget.style.boxShadow = 'none'
              const img = e.currentTarget.querySelector('img')
              if (img) (img as HTMLElement).style.transform = 'scale(1)'
              const btn = e.currentTarget.querySelector('.quick-view') as HTMLElement
              if (btn) btn.style.opacity = '0'
            }}
          >
            <img
              src="/pnp-07.jpg"
              alt="4D 5mm Road Legal Plate"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            />
            <div className="quick-view" style={{
              position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
              opacity: 0, transition: 'opacity 0.3s ease',
            }}>
              <span style={{
                padding: '10px 24px', borderRadius: '9999px',
                backgroundColor: 'rgba(17, 17, 17, 0.9)', backdropFilter: 'blur(20px)',
                border: '1px solid #222222', color: '#f2f3f4',
                fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                fontSize: '0.8rem', letterSpacing: '-0.72px', textTransform: 'uppercase',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                QUICK VIEW
              </span>
            </div>
          </div>
        </div>

        {/* Right: Text + Products */}
        <div ref={rightRef}>
          <h2 style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-1.5px',
            lineHeight: 1, textTransform: 'uppercase', marginBottom: '16px',
          }}>
            <span style={{ color: '#f2f3f4' }}>ROAD LEGAL. / </span>
            <span style={{ color: '#ffd700' }}>SHOW READY.</span>
          </h2>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1rem',
            lineHeight: 1.6, color: '#757575', marginBottom: '40px', maxWidth: '440px',
          }}>
            From fully compliant DVLA plates to bespoke show pieces, every plate is precision-cut and hand-finished in our UK workshop.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {products.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: { name: string; price: string; img: string } }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '8px',
      backgroundColor: 'rgba(17, 17, 17, 0.6)', backdropFilter: 'blur(20px)',
      border: hovered ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
      transition: 'border-color 0.3s ease',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={product.img}
        alt={product.name}
        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
          fontSize: '1rem', letterSpacing: '-0.72px', color: '#f2f3f4',
          textTransform: 'uppercase', marginBottom: '4px',
        }}>
          {product.name}
        </h3>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem',
          letterSpacing: '0.05em', color: '#ffd700',
        }}>
          {product.price}
        </p>
      </div>
      <button style={{
        padding: '8px 16px', borderRadius: '9999px', border: '1px solid #757575',
        backgroundColor: 'transparent', color: '#f2f3f4',
        fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600,
        fontSize: '0.7rem', letterSpacing: '-0.24px', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'border-color 0.3s ease, color 0.3s ease',
        flexShrink: 0, whiteSpace: 'nowrap',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ffd700'; e.currentTarget.style.color = '#ffd700' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#757575'; e.currentTarget.style.color = '#f2f3f4' }}
      >
        ADD TO BUILDER
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   SECTION 5: CRAFT & PRECISION
   ═══════════════════════════════════════════════ */
function CraftSection() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    if (!section || !text) return

    const ctx = gsap.context(() => {
      if (!isMobile) {
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 1,
          },
        })
      }

      const textEl = text.querySelectorAll('.craft-text')
      gsap.from(textEl, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      })
    }, section)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: isMobile ? '60vh' : '100vh',
        overflow: 'hidden',
        backgroundColor: '#050401',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Images */}
      {['/pnp-07.jpg', '/pnp-05.jpg', '/pnp-06.jpg', '/pnp-03.jpg'].map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === 0 ? 0.4 : 0.15,
            zIndex: 1,
          }}
        />
      ))}

      {/* Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(5, 4, 1, 0.75)', zIndex: 2,
      }} />

      {/* Text */}
      <div
        ref={textRef}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: isMobile ? '60px 20px' : '0 24px',
          textAlign: 'center',
        }}
      >
        <h2 className="craft-text" style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
          fontSize: isMobile ? '1.75rem' : 'clamp(2.5rem, 5vw, 4rem)',
          letterSpacing: isMobile ? '-0.5px' : '-1.5px',
          color: '#f2f3f4', textTransform: 'uppercase', lineHeight: 1.1,
          marginBottom: '16px', padding: '0 16px',
        }}>
          CRAFTED FOR THE DETAIL.
        </h2>
        <p className="craft-text" style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1rem',
          color: '#757575', maxWidth: '600px', lineHeight: 1.6, marginBottom: '32px',
        }}>
          4D laser-cut gel characters. Carbon composite backing. UV-cured resin finish.
        </p>
        <Link
          to="/product"
          className="craft-text"
          style={{
            padding: '14px 32px', borderRadius: '9999px', border: '1px solid #757575',
            backgroundColor: 'transparent', color: '#f2f3f4',
            fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
            fontSize: '1rem', letterSpacing: '-0.72px', textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'border-color 0.3s ease, color 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ffd700'; e.currentTarget.style.color = '#ffd700' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#757575'; e.currentTarget.style.color = '#f2f3f4' }}
        >
          EXPLORE MATERIALS
        </Link>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   SECTION 6: GALLERY PREVIEW
   ═══════════════════════════════════════════════ */
function GalleryPreviewSection() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 50, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 85%', children: true, stagger: 0.08,
  })
  const headerRef = useScrollReveal<HTMLDivElement>({
    y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', start: 'top 85%',
  })

  return (
    <section style={{ padding: isMobile ? '60px 0' : '100px 0', backgroundColor: '#111111' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        <div ref={headerRef} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px',
        }}>
          <h2 style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-1.5px',
            color: '#f2f3f4', textTransform: 'uppercase', lineHeight: 1,
          }}>
            GALLERY
          </h2>
          <Link
            to="/gallery"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '9999px',
              border: '1px solid #757575', backgroundColor: 'transparent', color: '#f2f3f4',
              fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600,
              fontSize: '0.85rem', letterSpacing: '-0.24px', textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'border-color 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ffd700'; e.currentTarget.style.color = '#ffd700' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#757575'; e.currentTarget.style.color = '#f2f3f4' }}
          >
            VIEW ALL
            <ArrowRight size={16} />
          </Link>
        </div>

        <div ref={gridRef} className="gallery-grid" style={{
          display: 'grid', gap: '16px',
        }}>
          {galleryImages.map((img, i) => (
            <div
              key={i}
              style={{
                position: 'relative', aspectRatio: '4/3', borderRadius: '8px',
                overflow: 'hidden', cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const image = e.currentTarget.querySelector('img')
                const overlay = e.currentTarget.querySelector('.gallery-overlay') as HTMLElement
                const label = e.currentTarget.querySelector('.gallery-label') as HTMLElement
                if (image) (image as HTMLElement).style.transform = 'scale(1.05)'
                if (overlay) overlay.style.opacity = '1'
                if (label) label.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                const image = e.currentTarget.querySelector('img')
                const overlay = e.currentTarget.querySelector('.gallery-overlay') as HTMLElement
                const label = e.currentTarget.querySelector('.gallery-label') as HTMLElement
                if (image) (image as HTMLElement).style.transform = 'scale(1)'
                if (overlay) overlay.style.opacity = '0'
                if (label) label.style.opacity = '0'
              }}
            >
              <img
                src={img.src}
                alt={img.label}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              />
              <div className="gallery-overlay" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '60%', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                opacity: 0, transition: 'opacity 0.3s ease', pointerEvents: 'none',
              }} />
              <div className="gallery-label" style={{
                position: 'absolute', bottom: '12px', left: '16px',
                fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                fontSize: '0.9rem', color: '#f2f3f4', textTransform: 'uppercase',
                letterSpacing: '-0.24px', opacity: 0, transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              }}>
                {img.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   SECTION 7: GOOGLE REVIEWS
   ═══════════════════════════════════════════════ */
function ReviewsSection() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const headerRef = useScrollReveal<HTMLDivElement>({
    y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', start: 'top 85%',
  })
  const cardsRef = useScrollReveal<HTMLDivElement>({
    x: -20, opacity: 0, duration: 0.8, ease: 'expo.out', start: 'top 85%',
    children: true, stagger: 0.12,
  })

  return (
    <section style={{ padding: isMobile ? '60px 0' : '100px 0', backgroundColor: '#050401' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
            letterSpacing: '0.2em', color: '#757575', textTransform: 'uppercase', marginBottom: '16px',
          }}>
            WHAT OUR CUSTOMERS SAY
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={20} fill="#ffd700" stroke="#ffd700" />
            ))}
          </div>
          <h2 style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-1.5px',
            color: '#f2f3f4', textTransform: 'uppercase', lineHeight: 1, marginBottom: '8px',
          }}>
            5.0 OUT OF 5
          </h2>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1rem',
            color: '#757575', marginBottom: '24px',
          }}>
            BASED ON 461 GOOGLE REVIEWS
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
            <a
              href="https://maps.app.goo.gl/P5FN5jQfMAKv4tgy7"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '9999px',
                border: '1px solid #757575', backgroundColor: 'transparent', color: '#f2f3f4',
                fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600,
                fontSize: '0.85rem', letterSpacing: '-0.24px', textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'border-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ffd700'; e.currentTarget.style.color = '#ffd700' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#757575'; e.currentTarget.style.color = '#f2f3f4' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              VIEW ON GOOGLE
              <ArrowRight size={14} />
            </a>
            <a
              href="https://search.google.com/local/writereview?placeid=ChIJZaCmAKCbcEgRw_NK6nFc0pc"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '9999px',
                border: '1px solid #ffd700', backgroundColor: '#ffd700', color: '#050401',
                fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                fontSize: '0.85rem', letterSpacing: '-0.24px', textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ffd700' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffd700'; e.currentTarget.style.color = '#050401' }}
            >
              <Star size={14} />
              WRITE A REVIEW
            </a>
          </div>
        </div>

        {/* Review Cards */}
        <div ref={cardsRef} style={{
          display: 'flex', gap: '16px', overflowX: 'auto',
          scrollSnapType: 'x mandatory', paddingBottom: '8px',
          scrollbarWidth: 'none',
        }}>
          {reviews.map((review, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0, width: '320px', padding: '24px', borderRadius: '8px',
                backgroundColor: 'rgba(17, 17, 17, 0.6)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                scrollSnapAlign: 'start',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: '#111111', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                    fontSize: '0.8rem', color: '#ffd700',
                  }}>
                    {review.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                    fontSize: '0.95rem', color: '#f2f3f4', textTransform: 'uppercase',
                    letterSpacing: '-0.24px',
                  }}>
                    {review.author}
                  </h3>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
                    color: '#757575', letterSpacing: '0.05em',
                  }}>
                    {review.date}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} fill={s <= review.rating ? '#ffd700' : 'transparent'} stroke={s <= review.rating ? '#ffd700' : '#555'} />
                ))}
              </div>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.85rem',
                lineHeight: 1.5, color: '#757575',
                display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   SECTION 8: CONTACT CTA
   ═══════════════════════════════════════════════ */
function ContactCTASection() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const ref = useScrollReveal<HTMLDivElement>({
    y: 40, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 80%',
  })

  return (
    <section style={{
      minHeight: 'auto', backgroundColor: '#111111', display: 'flex',
      alignItems: 'center', padding: isMobile ? '60px 24px' : '100px 24px',
    }}>
      <div ref={ref} style={{
        maxWidth: '800px', margin: '0 auto', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
          letterSpacing: '0.2em', color: '#ffd700', textTransform: 'uppercase', marginBottom: '16px',
        }}>
          GET IN TOUCH
        </p>
        <h2 style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
          fontSize: isMobile ? '1.75rem' : 'clamp(2rem, 3vw, 2.5rem)',
          letterSpacing: '-1.5px', color: '#f2f3f4',
          textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '20px',
        }}>
          SAME DAY SERVICE AVAILABLE.
        </h2>
        <p style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1rem',
          lineHeight: 1.6, color: '#757575', maxWidth: '480px',
          margin: '0 auto 32px',
        }}>
          Visit our store for same-day plate production. No appointment needed for standard plates. Professional fitting service available.
        </p>
        <Link
          to="/contact"
          style={{
            display: 'inline-block', padding: '16px 32px', borderRadius: '9999px',
            backgroundColor: '#ffd700', color: '#050401',
            fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
            fontSize: '1rem', letterSpacing: '-0.72px', textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          CONTACT US
        </Link>
      </div>
    </section>
  )
}
