import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, ArrowRight } from 'lucide-react'
import Marquee from 'react-fast-marquee'
import { useScrollReveal } from '../hooks/useScrollReveal'

const WebGLIntro = lazy(() => import('../components/WebGLIntro'))

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
  { name: '4D 5MM GEL BLACK', price: '\u00a324.99', img: '/plate-4d-gel-black-01.jpg' },
  { name: '4D GEL PLATE PAIR', price: '\u00a344.99', img: '/plate-4d-gel-black-02.jpg' },
  { name: '3D GEL DOMED SET', price: '\u00a339.99', img: '/plate-4d-gel-black-03.jpg' },
  { name: '4D LASER CUT SHOW', price: '\u00a329.99', img: '/plate-4d-gel-black-04.jpg' },
]

const galleryImages = [
  { src: '/plate-gallery-01.jpg', label: 'BMW M4 COMPETITION' },
  { src: '/plate-gallery-02.jpg', label: 'PORSCHE 911 CARRERA' },
  { src: '/plate-gallery-03.jpg', label: 'MERCEDES-AMG C63' },
  { src: '/plate-gallery-04.jpg', label: 'TESLA MODEL S' },
  { src: '/plate-gallery-05.jpg', label: 'AUDI RS6 AVANT' },
  { src: '/plate-gallery-06.jpg', label: 'BMW M3 CS' },
  { src: '/plate-gallery-07.jpg', label: 'PORSCHE 718 GT4' },
  { src: '/plate-gallery-08.jpg', label: 'RANGE ROVER SPORT' },
]

const stats = [
  { number: '10,000+', label: 'PLATES SOLD' },
  { number: '1,081', label: 'GOOGLE REVIEWS' },
  { number: '4.8', label: 'AVERAGE RATING' },
  { number: '24H', label: 'DISPATCH TIME' },
]

export default function Home() {
  return (
    <div style={{ backgroundColor: '#050401' }}>
      <Suspense fallback={null}>
        <WebGLIntro />
      </Suspense>
      <HeroSection />
      <TrustedBySection />
      <CollectionSection />
      <CraftSection />
      <GalleryPreviewSection />
      <ReviewsSection />
      <MotorpassSection />
    </div>
  )
}

/* ═══════════════════════════════════════════════
   SECTION 2: HERO
   ═══════════════════════════════════════════════ */
function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imgLeftRef = useRef<HTMLImageElement>(null)
  const imgRightRef = useRef<HTMLImageElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    const imgLeft = imgLeftRef.current
    const imgRight = imgRightRef.current
    const overlay = overlayRef.current
    if (!section || !text || !imgLeft || !imgRight || !overlay) return

    const ctx = gsap.context(() => {
      gsap.from(text.children, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: 'expo.out',
        delay: 3.5,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      })

      tl.fromTo(overlay, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0)
      tl.fromTo([imgLeft, imgRight], { opacity: 0.3 }, { opacity: 0.8, duration: 0.3 }, 0)
      tl.to(imgLeft, { x: '-100%', duration: 0.4 }, 0.3)
      tl.to(imgRight, { x: '100%', duration: 0.4 }, 0.3)

      const line1 = text.querySelector('.hero-line-1')
      const line2 = text.querySelector('.hero-line-2')
      if (line1) tl.to(line1, { y: '-100%', opacity: 0, duration: 0.3 }, 0.7)
      if (line2) tl.to(line2, { y: '100%', opacity: 0, duration: 0.3 }, 0.7)
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#050401',
      }}
    >
      <img
        ref={imgLeftRef}
        src="/hero-numberplate-closeup.jpg"
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.3,
          willChange: 'transform, opacity',
        }}
      />
      <img
        ref={imgRightRef}
        src="/hero-customer-plates.jpg"
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.3,
          mixBlendMode: 'lighten',
          willChange: 'transform, opacity',
        }}
      />

      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#050401',
          opacity: 1,
          zIndex: 2,
        }}
      />

      <div
        ref={textRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          padding: '0 24px',
        }}
      >
        <h1
          className="hero-line-1"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            letterSpacing: '-2.4px',
            color: '#f2f3f4',
            textTransform: 'uppercase',
            lineHeight: 0.85,
            textAlign: 'center',
          }}
        >
          YOUR REG,
        </h1>
        <h1
          className="hero-line-2"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            letterSpacing: '-2.4px',
            color: '#ffd700',
            textTransform: 'uppercase',
            lineHeight: 0.85,
            textAlign: 'center',
          }}
        >
          YOUR RULE.
        </h1>
        <Link
          to="/product"
          style={{
            marginTop: '32px',
            padding: '16px 32px',
            borderRadius: '9999px',
            backgroundColor: '#ffd700',
            color: '#050401',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '-0.72px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
            display: 'inline-block',
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
        <p
          style={{
            marginTop: '24px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '1rem',
            color: '#757575',
            maxWidth: '480px',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          Handcrafted number plates. Engineered for distinction. Road legal, show, and everything in between.
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   SECTION 3: TRUSTED BY THOUSANDS
   ═══════════════════════════════════════════════ */
function TrustedBySection() {
  const statsRef = useScrollReveal<HTMLDivElement>({
    y: 40, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 85%', children: true, stagger: 0.2,
  })
  const headerRef = useScrollReveal<HTMLDivElement>({
    y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', start: 'top 85%',
  })

  return (
    <section style={{ padding: '100px 0', backgroundColor: '#050401' }}>
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
            '1081 GOOGLE REVIEWS', 'DVLA APPROVED', 'NEXT-DAY DELIVERY', 'PREMIUM MATERIALS',
            '1081 GOOGLE REVIEWS', 'DVLA APPROVED', 'NEXT-DAY DELIVERY', 'PREMIUM MATERIALS',
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
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '80px',
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
  const leftRef = useScrollReveal<HTMLDivElement>({
    x: -40, y: 0, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 80%',
  })
  const rightRef = useScrollReveal<HTMLDivElement>({
    y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'expo.out', start: 'top 80%',
  })

  return (
    <section style={{ padding: '120px 0', backgroundColor: '#050401' }}>
      <div className="collection-grid" style={{
        maxWidth: '1440px', margin: '0 auto', padding: '0 24px',
        display: 'grid', gridTemplateColumns: '55% 45%', gap: '24px', alignItems: 'start',
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
              src="/plate-4d-gel-black-01.jpg"
              alt="4D 5mm Gel Black Plate"
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
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    if (!section || !text) return

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      })

      const textEl = text.querySelectorAll('.craft-text')
      gsap.from(textEl, {
        y: 60,
        opacity: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none none',
        },
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
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#050401',
      }}
    >
      {/* Background Images */}
      {['/plate-gallery-01.jpg', '/plate-gallery-02.jpg', '/plate-gallery-03.jpg', '/plate-gallery-04.jpg'].map((src, i) => (
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
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        <h2 className="craft-text" style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
          fontSize: 'clamp(2rem, 6vw, 5rem)', letterSpacing: '-1.5px',
          color: '#f2f3f4', textTransform: 'uppercase', lineHeight: 1,
          marginBottom: '24px',
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
  const gridRef = useScrollReveal<HTMLDivElement>({
    y: 50, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 85%', children: true, stagger: 0.08,
  })
  const headerRef = useScrollReveal<HTMLDivElement>({
    y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', start: 'top 85%',
  })

  return (
    <section style={{ padding: '120px 0', backgroundColor: '#111111' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        <div ref={headerRef} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px',
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
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
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
  const headerRef = useScrollReveal<HTMLDivElement>({
    y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', start: 'top 85%',
  })
  const cardsRef = useScrollReveal<HTMLDivElement>({
    x: -20, opacity: 0, duration: 0.8, ease: 'expo.out', start: 'top 85%',
    children: true, stagger: 0.12,
  })

  return (
    <section style={{ padding: '100px 0', backgroundColor: '#050401' }}>
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
            4.8 OUT OF 5
          </h2>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1rem',
            color: '#757575', marginBottom: '24px',
          }}>
            BASED ON 1,081 GOOGLE REVIEWS
          </p>
          <a
            href="https://www.google.com/search?q=topgear+plates+reviews"
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
            READ ALL REVIEWS
            <ArrowRight size={14} />
          </a>
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
   SECTION 8: MOTORPASS MEMBERSHIP
   ═══════════════════════════════════════════════ */
function MotorpassSection() {
  const leftRef = useScrollReveal<HTMLDivElement>({
    y: 60, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 80%',
  })
  const rightRef = useScrollReveal<HTMLDivElement>({
    x: 40, opacity: 0, duration: 1.2, delay: 0.3, ease: 'expo.out', start: 'top 80%',
  })

  return (
    <section id="motorpass" style={{
      minHeight: '100vh', backgroundColor: '#111111', display: 'flex',
      alignItems: 'center', padding: '120px 0',
    }}>
      <div style={{
        maxWidth: '1440px', margin: '0 auto', padding: '0 24px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px',
        alignItems: 'center',
      }} className="motorpass-grid">
        {/* Left — Text */}
        <div ref={leftRef}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
            letterSpacing: '0.2em', color: '#ffd700', textTransform: 'uppercase', marginBottom: '16px',
          }}>
            MEMBERSHIP
          </p>
          <h2 style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-1.5px',
            textTransform: 'uppercase', lineHeight: 1, marginBottom: '20px',
          }}>
            <span style={{ color: '#f2f3f4' }}>JOIN THE / </span>
            <span style={{ color: '#ffd700' }}>MOTORPASS.</span>
          </h2>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1rem',
            lineHeight: 1.6, color: '#757575', maxWidth: '480px', marginBottom: '32px',
          }}>
            Get exclusive pricing, early access to new styles, free shipping on every order, and priority customer support. The ultimate advantage for enthusiasts.
          </p>
          <Link
            to="/checkout"
            style={{
              display: 'inline-block', padding: '16px 32px', borderRadius: '9999px',
              backgroundColor: '#ffd700', color: '#050401',
              fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
              fontSize: '1rem', letterSpacing: '-0.72px', textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
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
            BECOME A MEMBER
          </Link>
          <div style={{ marginTop: '20px' }}>
            <Link
              to="/product"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.9rem',
                color: '#757575', textDecoration: 'none',
                borderBottom: '1px solid transparent',
                transition: 'color 0.3s ease, border-color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffd700'; e.currentTarget.style.borderColor = '#ffd700' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#757575'; e.currentTarget.style.borderColor = 'transparent' }}
            >
              LEARN MORE
            </Link>
          </div>
        </div>

        {/* Right — Card Mockup */}
        <div ref={rightRef} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            animation: 'float 4s ease-in-out infinite',
            boxShadow: '0 0 80px rgba(255, 215, 0, 0.15)',
            borderRadius: '16px',
          }}>
            <img
              src="/motorpass-card-mockup.png"
              alt="Motorpass Membership Card"
              style={{
                maxWidth: '100%', height: 'auto',
                filter: 'drop-shadow(0 0 40px rgba(255, 215, 0, 0.2))',
                borderRadius: '16px',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
