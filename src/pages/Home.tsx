import { useState } from 'react'
import { Link } from 'react-router'
import { Star, ArrowRight } from 'lucide-react'

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const stats = [
  { number: '10,000+', label: 'PLATES SOLD' },
  { number: '1,081', label: 'REVIEWS' },
  { number: '4.8', label: 'RATING' },
  { number: '24H', label: 'DISPATCH' },
]

const products = [
  { name: '4D 5MM ROAD LEGAL PLATES', price: '\u00a345.00', img: '/pnp-07.jpg' },
  { name: '4D GEL ROAD LEGAL PLATES', price: '\u00a355.00', img: '/pnp-05.jpg' },
  { name: 'GHOST ROAD LEGAL PLATES', price: '\u00a370.00', img: '/pnp-06.jpg' },
  { name: 'STANDARD NUMBER PLATES', price: '\u00a325.00', img: '/pnp-01.jpg' },
]

const galleryImages = [
  { src: '/pnp-07.jpg', label: '4D 5MM PLATES' },
  { src: '/pnp-05.jpg', label: '4D GEL PLATES' },
  { src: '/pnp-06.jpg', label: 'GHOST PLATES' },
  { src: '/pnp-03.jpg', label: '3D GEL PLATES' },
  { src: '/pnp-04.jpg', label: '4D 3MM ACRYLIC' },
  { src: '/pnp-02.jpg', label: '2D SHORT PLATES' },
]

const reviews = [
  {
    author: 'Giasa Rs',
    text: 'Really nice shop! polite and helpfull the staff are amazing (Kash) and so helpfull if you need number plates this is the place to go',
  },
  {
    author: "Alex O'Connor",
    text: 'Amazing service! Very fast delivery of my plates, hundreds of options to pick from',
  },
  {
    author: 'Mohammed Shahib',
    text: 'Great service, quick turnaround, and top quality plates. Staff were friendly and helpful',
  },
]

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
   MAIN EXPORT
   ────────────────────────────────────────────── */

export default function Home() {
  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      <HeroSection />
      <TrustBarSection />
      <ProductsSection />
      <AboutSection />
      <GallerySection />
      <ReviewsSection />
      <CTASection />
    </div>
  )
}

/* ═══════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════ */

function HeroSection() {
  return (
    <section
      style={{
        backgroundColor: C.bg,
        paddingTop: 'calc(64px + 40px + 80px)',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(2.5rem, 8vw, 7rem)',
          letterSpacing: '-0.05em',
          lineHeight: 0.9,
          color: C.text,
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        YOUR REG,
      </h1>
      <h1
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(2.5rem, 8vw, 7rem)',
          letterSpacing: '-0.05em',
          lineHeight: 0.9,
          color: C.gold,
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        YOUR RULE.
      </h1>

      <p
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '1rem',
          color: C.muted,
          maxWidth: '480px',
          lineHeight: 1.6,
          marginTop: '24px',
          marginBottom: '0',
        }}
      >
        Handcrafted number plates. Engineered for distinction.
      </p>

      <Link
        to="/product"
        style={{
          marginTop: '32px',
          padding: '16px 32px',
          borderRadius: '9999px',
          backgroundColor: C.gold,
          color: C.bg,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '1rem',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          display: 'inline-block',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.25)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        BROWSE COLLECTION
      </Link>

      {/* Hero Image */}
      <div
        style={{
          marginTop: '64px',
          width: '100%',
          maxWidth: '800px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: `1px solid ${C.border}`,
        }}
      >
        <img
          src="/product-main.jpg"
          alt="Premium number plate"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '500px',
            objectFit: 'cover',
            display: 'block',
          }}
          width="800"
          height="500"
        />
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   TRUST BAR
   ═══════════════════════════════════════════════ */

function TrustBarSection() {
  return (
    <section
      style={{
        backgroundColor: C.card,
        padding: '48px 24px',
      }}
    >
      <div
        className="trust-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                letterSpacing: '-0.03em',
                color: C.gold,
                lineHeight: 1,
                marginBottom: '8px',
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
   PRODUCTS SECTION
   ═══════════════════════════════════════════════ */

function ProductsSection() {
  return (
    <section
      style={{
        backgroundColor: C.bg,
        padding: '100px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            letterSpacing: '-0.05em',
            color: C.text,
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '48px',
            textAlign: 'center',
          }}
        >
          THE COLLECTION
        </h2>

        <div
          className="products-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({
  product,
}: {
  product: { name: string; price: string; img: string }
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
          aspectRatio: '1 / 1',
          overflow: 'hidden',
        }}
      >
        <img
          src={product.img}
          alt={product.name}
          width="400"
          height="400"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      </div>
      <div style={{ padding: '16px' }}>
        <h3
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '-0.02em',
            color: C.text,
            textTransform: 'uppercase',
            margin: '0 0 4px 0',
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            color: C.gold,
            margin: '0 0 12px 0',
          }}
        >
          {product.price}
        </p>
        <Link
          to="/product"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 600,
            fontSize: '0.8rem',
            color: C.muted,
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = C.gold
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = C.muted
          }}
        >
          VIEW
        </Link>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   ABOUT SECTION
   ═══════════════════════════════════════════════ */

function AboutSection() {
  return (
    <section
      id="about"
      style={{
        backgroundColor: C.bg,
        padding: '100px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.75rem, 4vw, 3.5rem)',
            letterSpacing: '-0.05em',
            color: C.text,
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '24px',
          }}
        >
          CRAFTED FOR THE DETAIL.
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
          Same day service on all our products. DVLA registered suppliers with next day delivery. Made with the best quality materials and backed by a 1 year warranty. All plates are BS AU145e compliant.
        </p>

        <Link
          to="/product"
          style={{
            padding: '14px 32px',
            borderRadius: '9999px',
            border: `1px solid ${C.muted}`,
            backgroundColor: 'transparent',
            color: C.text,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'inline-block',
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
          EXPLORE MATERIALS
        </Link>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   GALLERY SECTION
   ═══════════════════════════════════════════════ */

function GallerySection() {
  return (
    <section
      style={{
        backgroundColor: C.card,
        padding: '100px 24px',
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
            GALLERY
          </h2>
          <Link
            to="/gallery"
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
            VIEW ALL
            <ArrowRight size={16} />
          </Link>
        </div>

        <div
          className="gallery-home-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          {galleryImages.map((img, i) => (
            <div
              key={i}
              style={{
                borderRadius: '8px',
                overflow: 'hidden',
                aspectRatio: '4 / 3',
              }}
            >
              <img
                src={img.src}
                alt={img.label}
                width="400"
                height="300"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   REVIEWS SECTION
   ═══════════════════════════════════════════════ */

function ReviewsSection() {
  return (
    <section
      style={{
        backgroundColor: C.bg,
        padding: '100px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              color: C.muted,
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            WHAT OUR CUSTOMERS SAY
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '4px',
              marginBottom: '12px',
            }}
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={20}
                fill={C.gold}
                stroke={C.gold}
              />
            ))}
          </div>

          <h2
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              letterSpacing: '-0.05em',
              color: C.text,
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: '4px',
            }}
          >
            4.8 out of 5
          </h2>
        </div>

        <div
          className="reviews-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ReviewCard({
  review,
}: {
  review: { author: string; text: string }
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '8px',
        backgroundColor: C.card,
        border: `1px solid ${hovered ? 'rgba(255, 215, 0, 0.2)' : C.border}`,
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: C.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: C.gold,
            }}
          >
            {review.author
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </span>
        </div>
        <h3
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: C.text,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {review.author}
        </h3>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '2px',
          marginBottom: '12px',
        }}
      >
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            fill={C.gold}
            stroke={C.gold}
          />
        ))}
      </div>

      <p
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          color: C.muted,
          margin: 0,
        }}
      >
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════════ */

function CTASection() {
  return (
    <section
      style={{
        backgroundColor: C.card,
        padding: '100px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            letterSpacing: '-0.05em',
            color: C.text,
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          READY TO UPGRADE?
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
          Build your perfect plate today. Road legal, show plates, and bespoke
          designs — crafted with precision.
        </p>

        <Link
          to="/product"
          style={{
            display: 'inline-block',
            padding: '16px 32px',
            borderRadius: '9999px',
            backgroundColor: C.gold,
            color: C.bg,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.25)'
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
