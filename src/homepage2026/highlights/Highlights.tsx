import { Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { HighlightCard } from './HighlightCard'
import { HIGHLIGHTS } from './highlights-data'

export function Highlights() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      className={[
        'py-14 md:py-20',
        'transition-all duration-700 ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      ].join(' ')}
      id="highlights"
      ref={sectionRef}
    >
      <div className="mx-auto max-w-[1060px] px-7">
        <p className="mb-6 flex items-center gap-2 font-mono2026 text-xs uppercase tracking-[0.15em] text-h2026-muted">
          <Zap className="text-h2026-green" size={16} />
          SIV Highlights
        </p>
      </div>

      <div className="relative">
        <div
          className="flex items-stretch gap-3 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
          style={{
            paddingLeft: 'max(1.75rem, calc((100vw - 1060px) / 2 + 1.75rem))',
            paddingRight: '4rem',
          }}
        >
          {HIGHLIGHTS.map((h) => (
            <HighlightCard key={h.id} {...h} />
          ))}
        </div>

        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l to-transparent pointer-events-none from-h2026-bg" />
      </div>
    </section>
  )
}
