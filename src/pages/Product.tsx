import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'
import {
  Star,
  ShoppingCart,
  Truck,
  Package,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Plus,
  Store,
} from 'lucide-react'

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const galleryImages = [
  '/pnp-07.jpg',
  '/pnp-05.jpg',
  '/pnp-06.jpg',
  '/pnp-03.jpg',
  '/pnp-04.jpg',
  '/pnp-02.jpg',
]

const relatedProducts = [
  { id: 1, name: '4D GEL ROAD LEGAL PLATES', price: '\u00a355.00', desc: 'Premium 4D gel plates with raised black gel characters. DVLA compliant.', image: '/pnp-05.jpg' },
  { id: 2, name: 'GHOST ROAD LEGAL PLATES', price: '\u00a370.00', desc: 'Stealth ghost plates with subtle reflective finish. Road legal.', image: '/pnp-06.jpg' },
  { id: 3, name: 'HEX PLATES', price: '\u00a370.00', desc: 'Unique hexagonal cut design plates with distinctive geometric styling.', image: '/pnp-09.jpg' },
  { id: 4, name: '4D 3MM ACRYLIC PLATES', price: '\u00a335.00', desc: 'Precision-cut 3mm acrylic characters. Road legal and DVLA compliant.', image: '/pnp-04.jpg' },
]

const galleryTeaserImages = [
  { src: '/pnp-07.jpg', label: '4D 5MM PLATES', aspect: '4/3' },
  { src: '/pnp-05.jpg', label: '4D GEL PLATES', aspect: '3/4' },
  { src: '/pnp-03.jpg', label: '3D GEL PLATES', aspect: '4/3' },
  { src: '/pnp-06.jpg', label: 'GHOST PLATES', aspect: '3/4' },
  { src: '/pnp-09.jpg', label: 'HEX PLATES', aspect: '4/3' },
  { src: '/pnp-04.jpg', label: '4D 3MM ACRYLIC', aspect: '3/4' },
]

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

export default function Product() {
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'road' | 'show'>('description')
  const [isStickyVisible, setIsStickyVisible] = useState(false)
  const addToCartRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!addToCartRef.current) return
      const rect = addToCartRef.current.getBoundingClientRect()
      setIsStickyVisible(rect.bottom < 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const prevImg = () => setSelectedImg((i) => (i === 0 ? galleryImages.length - 1 : i - 1))
  const nextImg = () => setSelectedImg((i) => (i === galleryImages.length - 1 ? 0 : i + 1))

  const tabContent: Record<string, { title: string; text: string }> = {
    description: {
      title: 'Description',
      text: 'Upgrade your vehicle with Punjabi Number Plates Premium Plates. Same day service on all our products. DVLA registered suppliers with next day delivery. Made with the best quality materials and backed by a 1 year warranty. All plates are BS AU145e compliant.',
    },
    road: {
      title: 'Road Legal Info',
      text: 'Punjabi Number Plates Ltd is a recognised reseller of DVLA registrations. All road legal plates are manufactured to meet DVLA regulations and are legal for use on UK public roads. BS AU145e compliant.',
    },
    show: {
      title: 'Show Plates',
      text: 'Show plates are intended for off-road, display, show, or private land use only. Not DVLA compliant. No legal markings. Not for use on public roads.',
    },
  }

  return (
    <div style={{ backgroundColor: C.bg, minHeight: '100vh' }}>
      {/* ── Breadcrumb ── */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '24px 24px 0',
        }}
      >
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.8rem',
              color: C.muted,
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
          >
            Home
          </Link>
          <span style={{ color: C.muted, fontSize: '0.8rem' }}>/</span>
          <Link
            to="/product"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.8rem',
              color: C.muted,
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
          >
            Shop
          </Link>
          <span style={{ color: C.muted, fontSize: '0.8rem' }}>/</span>
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.8rem',
              color: C.text,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            4D 5MM ROAD LEGAL PLATES
          </span>
        </nav>
      </div>

      {/* ── Product Main ── */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
        }}
        className="collection-grid"
      >
        {/* Gallery */}
        <ProductGallery
          selectedImg={selectedImg}
          setSelectedImg={setSelectedImg}
          prevImg={prevImg}
          nextImg={nextImg}
        />

        {/* Product Info */}
        <div>
          <h1
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              letterSpacing: '-0.05em',
              lineHeight: 1,
              color: C.text,
              textTransform: 'uppercase',
              margin: '0 0 16px 0',
            }}
          >
            4D 5MM ROAD LEGAL PLATES
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < 5 ? C.gold : 'transparent'}
                  color={i < 5 ? C.gold : C.muted}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.8rem',
                color: C.muted,
              }}
            >
              1,081 reviews
            </span>
          </div>

          {/* Price */}
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '1.75rem',
              color: C.gold,
              margin: '0 0 24px 0',
            }}
          >
            £45.00
          </p>

          {/* Short info */}
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.95rem',
              color: C.muted,
              lineHeight: 1.6,
              margin: '0 0 24px 0',
            }}
          >
            Precision-crafted 5mm acrylic number plates with laser-cut black characters. Road legal, DVLA compliant, and built to last.
          </p>

          {/* Feature bullets */}
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'DVLA Road Legal & BS AU145e Compliant',
              'Same Day Service Available',
              '1 Year Warranty',
              'Next Day Delivery',
              'Premium 5MM Acrylic Construction',
            ].map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.85rem',
                  color: C.text,
                }}
              >
                <Check size={16} color={C.gold} />
                {item}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: C.border, marginBottom: '24px' }} />

          {/* Quantity */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: C.muted,
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              Quantity
            </label>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: `1px solid ${C.border}`,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: C.text,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.border)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Minus size={16} />
              </button>
              <span
                style={{
                  width: '48px',
                  textAlign: 'center',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: C.text,
                }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: C.text,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.border)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            ref={addToCartRef}
            style={{
              width: '100%',
              padding: '16px 32px',
              borderRadius: '9999px',
              backgroundColor: C.gold,
              color: C.bg,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              marginBottom: '16px',
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
            <ShoppingCart size={18} />
            Add to Cart — £{(45 * qty).toFixed(2)}
          </button>

          {/* Delivery badges */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            <DeliveryBadge icon={<Truck size={16} />} text="Free next day delivery on all orders" />
            <DeliveryBadge icon={<Store size={16} />} text="In-store pickup available at Punjabi Number Plates. Same day service." />
            <DeliveryBadge icon={<Package size={16} />} text="Dispatched within 24 hours" />
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: C.border, marginBottom: '24px' }} />

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
            {(['description', 'road', 'show'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === tab ? C.card : 'transparent',
                  color: activeTab === tab ? C.gold : C.muted,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: activeTab === tab ? 700 : 600,
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                }}
              >
                {tabContent[tab].title}
              </button>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.9rem',
              color: C.muted,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {tabContent[activeTab].text}
          </p>
        </div>
      </section>

      {/* ── Related Products ── */}
      <RelatedProductsSection />

      {/* ── Gallery Teaser ── */}
      <GalleryTeaserSection />

      {/* ── Sticky Bar ── */}
      <StickyBar visible={isStickyVisible} qty={qty} setQty={setQty} />
    </div>
  )
}

/* ═══════════════════════════════════════════════
   PRODUCT GALLERY
   ═══════════════════════════════════════════════ */

function ProductGallery({
  selectedImg,
  setSelectedImg,
  prevImg,
  nextImg,
}: {
  selectedImg: number
  setSelectedImg: (i: number) => void
  prevImg: () => void
  nextImg: () => void
}) {
  return (
    <div>
      {/* Main image */}
      <div
        style={{
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          border: `1px solid ${C.border}`,
          backgroundColor: C.card,
          aspectRatio: '4/3',
        }}
      >
        <img
          src={galleryImages[selectedImg]}
          alt="4D 5MM Road Legal Plates"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Nav arrows */}
        <GalleryArrow direction="left" onClick={prevImg} />
        <GalleryArrow direction="right" onClick={nextImg} />
      </div>

      {/* Thumbnails */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
          marginTop: '12px',
        }}
      >
        {galleryImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImg(i)}
            style={{
              borderRadius: '6px',
              overflow: 'hidden',
              border: `2px solid ${selectedImg === i ? C.gold : C.border}`,
              padding: 0,
              cursor: 'pointer',
              backgroundColor: C.card,
              aspectRatio: '1/1',
              transition: 'border-color 0.2s ease',
            }}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: selectedImg === i ? 1 : 0.6,
                transition: 'opacity 0.2s ease',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function GalleryArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [direction]: '12px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(5, 4, 1, 0.7)',
        border: `1px solid ${C.border}`,
        color: C.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(4px)',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        zIndex: 2,
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(5, 4, 1, 0.9)'
        e.currentTarget.style.borderColor = C.gold
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(5, 4, 1, 0.7)'
        e.currentTarget.style.borderColor = C.border
      }}
    >
      {direction === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  )
}

/* ═══════════════════════════════════════════════
   DELIVERY BADGE
   ═══════════════════════════════════════════════ */

function DeliveryBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.8rem',
        color: C.muted,
      }}
    >
      <span style={{ color: C.gold, flexShrink: 0 }}>{icon}</span>
      {text}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   RELATED PRODUCTS
   ═══════════════════════════════════════════════ */

function RelatedProductsSection() {
  return (
    <section
      style={{
        backgroundColor: C.card,
        padding: '80px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            letterSpacing: '-0.05em',
            color: C.text,
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '40px',
          }}
        >
          You May Also Like
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }}
          className="gallery-grid"
        >
          {relatedProducts.map((product) => (
            <RelatedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedProductCard({
  product,
}: {
  product: { id: number; name: string; price: string; desc: string; image: string }
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to="/product"
      style={{
        display: 'block',
        textDecoration: 'none',
        backgroundColor: C.bg,
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${hovered ? 'rgba(255, 215, 0, 0.3)' : C.border}`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 32px rgba(0, 0, 0, 0.4)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
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
            fontSize: '0.85rem',
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
            margin: '0 0 8px 0',
          }}
        >
          {product.price}
        </p>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.8rem',
            color: C.muted,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {product.desc}
        </p>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════
   GALLERY TEASER
   ═══════════════════════════════════════════════ */

function GalleryTeaserSection() {
  return (
    <section
      style={{
        backgroundColor: C.bg,
        padding: '80px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            letterSpacing: '-0.05em',
            color: C.text,
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '40px',
          }}
        >
          Our Plates In Action
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
          className="gallery-home-grid"
        >
          {galleryTeaserImages.map((img, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                aspectRatio: img.aspect,
                border: `1px solid ${C.border}`,
              }}
            >
              <img
                src={img.src}
                alt={img.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '20px',
                  background: 'linear-gradient(transparent, rgba(5,4,1,0.8))',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                    color: C.text,
                    textTransform: 'uppercase',
                  }}
                >
                  {img.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════
   STICKY BAR
   ═══════════════════════════════════════════════ */

function StickyBar({
  visible,
  qty,
  setQty,
}: {
  visible: boolean
  qty: number
  setQty: (q: number | ((prev: number) => number)) => void
}) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${C.border}`,
        padding: '12px 24px',
        zIndex: 100,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              color: C.muted,
              textTransform: 'uppercase',
              display: 'block',
            }}
          >
            4D 5MM ROAD LEGAL PLATES
          </span>
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '1.25rem',
              color: C.gold,
            }}
          >
            £45.00
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: `1px solid ${C.border}`,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setQty((q: number) => Math.max(1, q - 1))}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                color: C.text,
                cursor: 'pointer',
              }}
            >
              <Minus size={14} />
            </button>
            <span
              style={{
                width: '36px',
                textAlign: 'center',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: C.text,
              }}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty((q: number) => q + 1)}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                color: C.text,
                cursor: 'pointer',
              }}
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            style={{
              padding: '12px 28px',
              borderRadius: '9999px',
              backgroundColor: C.gold,
              color: C.bg,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
