import Markdown from 'react-markdown'

import { ScrollReveal } from './ScrollReveal'

const PROPERTIES: { description: string; word: string }[] = [
  {
    description: 'Vote from any device, in seconds. No installs needed.',
    word: 'Easy',
  },
  {
    description:
      'Strong privacy, verifiability, and coercion-resistance. \nPublicly [auditable code](https://github.com/siv-org/siv).',
    word: 'Safe',
  },
  {
    description: 'Supports smarter voting methods, fundamentally transforming our options.',
    word: 'Smart',
  },
]

export function Properties() {
  return (
    <section className="px-7 py-16 md:py-24 mx-auto max-w-[1060px]" id="properties">
      <div className="grid gap-12 md:grid-cols-3 md:gap-0">
        {/* Properties */}
        {PROPERTIES.map(({ description, word }, i) => (
          <ScrollReveal className="flex flex-col items-center text-center md:px-10" delay={i * 0.12} key={word}>
            {/* Name */}
            <span className="font-serif26 text-[clamp(2rem,4vw,2.8rem)] font-normal tracking-tight text-h2026-text">
              {word}
            </span>

            {/* Short divider */}
            <div className="mt-3 w-8 h-px bg-h2026-green/30" />

            {/* Description */}
            <div className="whitespace-pre-wrap mt-4 max-w-[280px] text-[1rem] leading-[1.7] text-h2026-textSecondary">
              <Markdown
                components={{
                  a: ({ children, href, ...props }) => (
                    <a
                      className="font-medium hover:underline"
                      {...{ children, href }}
                      rel="noreferrer noopener"
                      target="_blank"
                      {...props}
                    />
                  ),
                }}
              >
                {description}
              </Markdown>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
