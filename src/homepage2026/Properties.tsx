import Image from 'next/image'
import Markdown from 'react-markdown'

import logo from '../homepage/logo.png'
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
    <section aria-labelledby="properties-heading" className="px-7 py-16 md:py-24" id="properties">
      <div className="mx-auto max-w-[1060px]">
        <header className="flex flex-col gap-3 items-start mb-14 text-left md:pl-10">
          <div className="flex items-baseline gap-2.5">
            <Image alt="" aria-hidden height={20} src={logo} width={(50 / 23) * 20} />
            <span
              className="font-mono2026 text-[0.6rem] uppercase tracking-[0.2em] text-h2026-green"
              id="properties-heading"
            >
              Pillars:
            </span>
          </div>
        </header>
        <div className="grid gap-12 md:grid-cols-3 md:gap-0">
          {PROPERTIES.map(({ description, word }, i) => (
            <ScrollReveal className="flex flex-col items-start text-left md:px-10" delay={i * 0.12} key={word}>
              <span className="font-serif2026 text-[clamp(2rem,4vw,2.8rem)] font-normal tracking-tight text-h2026-text">
                {word}
              </span>
              <div className="mt-3 w-8 h-px bg-h2026-green/30" />
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
      </div>
    </section>
  )
}
