import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppChat from './WhatsAppChat'
import CartDrawer from './CartDrawer'

gsap.registerPlugin(ScrollTrigger)

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '104px' }}>
        {children}
      </div>
      <Footer />
      <WhatsAppChat />
      <CartDrawer />
    </>
  )
}
