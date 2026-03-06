import { Check, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { HighlightCard } from './HighlightCard'
import { DEPLOYMENTS, SECURITY_SOLUTIONS } from './highlights-data'

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

  const [congress, trust, zcash, harlem, firstNation, alongside, officials] = DEPLOYMENTS

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
          <HighlightCard
            body="For decades, digital voting was correctly considered unsafe. SIV solved:"
            className="w-[320px]"
            tag="Security"
            title="Strong solutions, built & deployed"
          >
            <ul className="mt-3 grid gap-1.5">
              {SECURITY_SOLUTIONS.map((item) => (
                <li className="flex items-start gap-2 text-[0.78rem] text-h2026-textSecondary" key={item}>
                  <Check className="mt-0.5 size-3 shrink-0 text-h2026-green" />
                  {item}
                </li>
              ))}
            </ul>
          </HighlightCard>

          <HighlightCard className="w-[240px]" tag={congress.tag} title={congress.title} />

          <HighlightCard
            body={trust.body}
            className="w-[300px]"
            quote={trust.quote}
            tag={trust.tag}
            title={trust.title}
          />

          <HighlightCard body={zcash.body} className="w-[240px]" tag={zcash.tag} title={zcash.title} />
          <HighlightCard body={harlem.body} className="w-[240px]" tag={harlem.tag} title={harlem.title} />
          <HighlightCard
            body={firstNation.body}
            className="w-[240px]"
            tag={firstNation.tag}
            title={firstNation.title}
          />
          <HighlightCard body={alongside.body} className="w-[260px]" tag={alongside.tag} title={alongside.title} />
          <HighlightCard body={officials.body} className="w-[280px]" tag={officials.tag} title={officials.title} />
        </div>

        {/* Right edge fade to hint at scrollability */}
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l to-transparent pointer-events-none from-h2026-bg" />
      </div>
    </section>
  )
}
