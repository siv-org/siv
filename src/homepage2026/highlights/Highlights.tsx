import { Sparkles } from 'lucide-react'
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
          <Sparkles className="text-h2026-green" size={16} />
          Highlights
        </p>

        <div className="relative">
          <div
            className={[
              'flex items-stretch gap-3 overflow-x-auto px-1 pb-5',
              '[scrollbar-width:thin] [scrollbar-color:theme(colors.h2026-border)_transparent]',
              '[&::-webkit-scrollbar]:h-[5px]',
              '[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent',
              '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-h2026-border',
              'hover:[&::-webkit-scrollbar-thumb]:bg-h2026-muted',
            ].join(' ')}
          >
            {HIGHLIGHTS.map((h) => (
              <HighlightCard key={h.id} {...h} />
            ))}
          </div>

          <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent pointer-events-none from-h2026-bg" />
          <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l to-transparent pointer-events-none from-h2026-bg" />
        </div>
      </div>
    </section>
  )
}
