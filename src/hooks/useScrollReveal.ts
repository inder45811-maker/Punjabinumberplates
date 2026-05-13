import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  y?: number
  x?: number
  opacity?: number
  duration?: number
  delay?: number
  stagger?: number
  ease?: string
  start?: string
  children?: boolean
}

export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null)
  const {
    y = 60,
    x = 0,
    opacity = 0,
    duration = 1.0,
    delay = 0,
    stagger = 0,
    ease = 'expo.out',
    start = 'top 85%',
    children = false,
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = children ? el.children : el

    gsap.set(targets, { y, x, opacity })

    const tl = gsap.to(targets, {
      y: 0,
      x: 0,
      opacity: 1,
      duration,
      delay,
      stagger: stagger || undefined,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill()
      })
    }
  }, [y, x, opacity, duration, delay, stagger, ease, start, children])

  return ref
}
