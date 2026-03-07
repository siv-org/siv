'use client'

import { useEffect, useRef, useState } from 'react'

const FADE_DURATION = '0.8s'

type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
  /** Delay in seconds before starting the animation (for stagger). */
  delay?: number
}

/**
 * Reveals children with the same fadeInUp animation as the hero when they
 * enter the viewport (or on initial load if already in view).
 */
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
        visible
          ? {
              animation: `fadeInUp ${FADE_DURATION} ease both`,
              animationDelay: delay ? `${delay}s` : undefined,
            }
          : { opacity: 0, transform: 'translateY(16px)' }
      }
    >
      {children}
    </div>
  )
}
