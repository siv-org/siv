const PROPERTIES: { description: string; word: string }[] = [
  {
    description: 'Vote from any device, in seconds. No installs needed.',
    word: 'Easy',
  },
  {
    description: 'Strong privacy, verifiability, and coercion-resistance. \nPublicly auditable code.',
    word: 'Safe',
  },
  {
    description:
      'Supports better spoiler-free voting methods. Improve the fundamental nature of the collective conversation.',
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
              <p className="whitespace-pre-wrap mt-4 max-w-[280px] text-[1rem] leading-[1.7] text-h2026-textSecondary">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
