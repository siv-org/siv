const PROPERTIES: { description: string; word: string }[] = [
  {
    description: 'Vote from any device in under a minute. No apps to install, no training needed, no friction.',
    word: 'Easy',
  },
  {
    description: 'End-to-end encrypted. Independently auditable. Red-teamed by top security researchers.',
    word: 'Safe',
  },
  {
    description: 'Ranked choice, approval, weighted — every method built in. Real-time results, full transparency.',
    word: 'Smart',
  },
]

export function Properties() {
  return (
    <section className="px-7 py-16 md:py-24" id="properties">
      <div className="mx-auto max-w-[1060px]">
        <div className="grid gap-12 md:grid-cols-3 md:gap-0">
          {PROPERTIES.map(({ description, word }, i) => (
            <div
              className={`flex flex-col items-center text-center md:px-10 ${
                i > 0 ? 'md:border-l md:border-h2026-border' : ''
              }`}
              key={word}
            >
              <span className="font-serif2026 text-[clamp(2rem,4vw,2.8rem)] font-normal tracking-tight text-h2026-text">
                {word}
              </span>
              <div className="mt-3 w-8 h-px bg-h2026-green/30" />
              <p className="mt-4 max-w-[280px] text-[0.82rem] leading-[1.7] text-h2026-textSecondary">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
