import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Star, MapPin, Clock, Award, Truck, Shield, Users } from 'lucide-react'

const stats = [
  { number: '500+', label: 'INSTALLATIONS', icon: Users },
  { number: '50+', label: 'VEHICLE BRANDS', icon: Truck },
  { number: '5\u2605', label: 'AVERAGE RATING', icon: Star },
]

const values = [
  { title: 'SAME DAY SERVICE', desc: 'All plates made while you wait. No appointment needed for standard plates.', icon: Clock },
  { title: 'DVLA APPROVED', desc: 'Registered DVLA supplier. All road legal plates fully compliant with BS AU145e.', icon: Shield },
  { title: 'PREMIUM QUALITY', desc: 'We use only the best materials with a 1-year warranty on all products.', icon: Award },
  { title: 'EXPERT FITTING', desc: 'Professional installation service available. We ensure perfect fitment every time.', icon: MapPin },
]

export default function About() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const heroRef = useScrollReveal<HTMLDivElement>({ y: 40, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 80%' })
  const storyRef = useScrollReveal<HTMLDivElement>({ y: 40, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 80%' })
  const valuesRef = useScrollReveal<HTMLDivElement>({ y: 40, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 80%', children: true, stagger: 0.15 })
  const statsRef = useScrollReveal<HTMLDivElement>({ y: 40, opacity: 0, duration: 1.0, ease: 'expo.out', start: 'top 85%', children: true, stagger: 0.2 })

  return (
    <div style={{ backgroundColor: '#050401', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ padding: isMobile ? '140px 16px 60px' : '180px 24px 80px', backgroundColor: '#050401' }}>
        <div ref={heroRef} style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', letterSpacing: '0.2em',
            color: '#ffd700', textTransform: 'uppercase', marginBottom: '16px',
          }}>
            ABOUT US
          </p>
          <h1 style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
            fontSize: isMobile ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(3rem, 5vw, 4rem)',
            letterSpacing: '-1.5px', color: '#f2f3f4', textTransform: 'uppercase',
            lineHeight: 1, marginBottom: '24px',
          }}>
            THE NUMBER PLATE SHOP
          </h1>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1.1rem',
            color: '#757575', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto',
          }}>
            Premium number plate specialists. Same day service on all our products.
            DVLA registered suppliers with next day delivery.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: isMobile ? '40px 16px' : '60px 24px', backgroundColor: '#111111' }}>
        <div ref={statsRef} style={{
          maxWidth: '1440px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)', gap: '24px',
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <stat.icon size={isMobile ? 24 : 32} style={{ color: '#ffd700', marginBottom: '12px' }} />
              <div style={{
                fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                fontSize: isMobile ? '1.5rem' : 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-1.5px',
                color: '#ffd700', lineHeight: 1, marginBottom: '8px',
              }}>
                {stat.number}
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
                letterSpacing: '0.1em', color: '#757575', textTransform: 'uppercase',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section style={{ padding: isMobile ? '60px 16px' : '100px 24px', backgroundColor: '#050401' }}>
        <div ref={storyRef} style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <img
              src="/pnp-07.webp"
              alt="The Number Plate Shop"
              style={{ width: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #222222' }}
            />
          </div>
          <div>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', letterSpacing: '0.2em',
              color: '#ffd700', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              OUR STORY
            </p>
            <h2 style={{
              fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
              fontSize: isMobile ? '1.75rem' : 'clamp(2rem, 3vw, 2.5rem)',
              letterSpacing: '-1.5px', color: '#f2f3f4', textTransform: 'uppercase',
              lineHeight: 1, marginBottom: '24px',
            }}>
              CRAFTED FOR THE DETAIL.
            </h2>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1rem',
              color: '#757575', lineHeight: 1.6, marginBottom: '16px',
            }}>
              Same day service on all our products. DVLA registered suppliers with next day delivery.
              Made with the best quality materials and backed by a 1 year warranty.
              All plates are BS AU145e compliant.
            </p>
            <p style={{
              fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1rem',
              color: '#757575', lineHeight: 1.6, marginBottom: '32px',
            }}>
              From 4D laser-cut gel characters to premium custom finishes,
              every plate is precision-crafted for a clean, high-quality look.
            </p>
            <Link
              to="/categories/number-plates"
              style={{
                padding: '14px 32px', borderRadius: '9999px', backgroundColor: '#ffd700',
                color: '#050401', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                fontSize: '1rem', letterSpacing: '-0.72px', textTransform: 'uppercase',
                textDecoration: 'none', display: 'inline-block',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: isMobile ? '60px 16px' : '100px 24px', backgroundColor: '#111111' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', letterSpacing: '0.2em',
              color: '#ffd700', textTransform: 'uppercase', marginBottom: '16px',
            }}>
              WHY CHOOSE US
            </p>
            <h2 style={{
              fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
              fontSize: isMobile ? '1.75rem' : 'clamp(2rem, 3vw, 2.5rem)',
              letterSpacing: '-1.5px', color: '#f2f3f4', textTransform: 'uppercase',
              lineHeight: 1,
            }}>
              THE PNP DIFFERENCE
            </h2>
          </div>
          <div ref={valuesRef} style={{
            display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px',
          }}>
            {values.map((value) => (
              <div key={value.title} style={{
                padding: '32px', borderRadius: '8px', backgroundColor: 'rgba(17, 17, 17, 0.6)',
                backdropFilter: 'blur(20px)', border: '1px solid #222222',
              }}>
                <value.icon size={28} style={{ color: '#ffd700', marginBottom: '16px' }} />
                <h3 style={{
                  fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                  fontSize: '1.1rem', letterSpacing: '-0.5px', color: '#f2f3f4',
                  textTransform: 'uppercase', marginBottom: '8px',
                }}>
                  {value.title}
                </h3>
                <p style={{
                  fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.95rem',
                  color: '#757575', lineHeight: 1.5,
                }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{ padding: isMobile ? '60px 16px' : '80px 24px', backgroundColor: '#050401' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
            fontSize: isMobile ? '1.5rem' : 'clamp(2rem, 3vw, 2.5rem)',
            letterSpacing: '-1.5px', color: '#f2f3f4', textTransform: 'uppercase',
            lineHeight: 1, marginBottom: '16px',
          }}>
            VISIT OUR STORE
          </h2>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: '1rem',
            color: '#757575', lineHeight: 1.6, marginBottom: '32px',
          }}>
            Come see us for same-day service. No appointment needed.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/contact"
              style={{
                padding: '14px 32px', borderRadius: '9999px', backgroundColor: '#ffd700',
                color: '#050401', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                fontSize: '1rem', letterSpacing: '-0.72px', textTransform: 'uppercase',
                textDecoration: 'none', display: 'inline-block',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              CONTACT US
            </Link>
            <Link
              to="/categories/number-plates"
              style={{
                padding: '14px 32px', borderRadius: '9999px', border: '1px solid #757575',
                backgroundColor: 'transparent', color: '#f2f3f4',
                fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700,
                fontSize: '1rem', letterSpacing: '-0.72px', textTransform: 'uppercase',
                textDecoration: 'none', display: 'inline-block',
                transition: 'border-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ffd700'; e.currentTarget.style.color = '#ffd700' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#757575'; e.currentTarget.style.color = '#f2f3f4' }}
            >
              SHOP PLATES
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
