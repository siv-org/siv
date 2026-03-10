'use client'

import { useEffect, useRef, useState } from 'react'

const FADE_DURATION = '0.8s'

type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number // Stagger delay in seconds before starting the animation
}

/** Reveal children with fadeInUp animation when they enter viewport
    (or on initial load if already in view). */
export function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.08 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      className={className}
      ref={ref}
      style={
        !visible
          ? { opacity: 0, transform: 'translateY(16px)' }
          : { animation: `fadeInUp ${FADE_DURATION} ease both`, animationDelay: delay ? `${delay}s` : '' }
      }
    >
      {children}
    </div>
  )
}
