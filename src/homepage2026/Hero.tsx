import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import type { ModalVariant } from './modalContent'

type HeroProps = {
  onWordClick: (variant: ModalVariant) => void
}

const HERO_WORDS: { label: string; variant: ModalVariant }[] = [
  { label: 'Easy', variant: 'easy' },
  { label: 'Safe', variant: 'safe' },
  { label: 'Smart', variant: 'smart' },
]

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const ROTATING_WORDS = ['Voting', 'Democracy']
const INITIAL_PAUSE_MS = 1500
const PAUSE_MS = 3500
const FRAME_MS = 55
const FRAMES_PER_CHAR = 4

type CharState = { char: string; resolved: boolean }

export function Hero({ onWordClick }: HeroProps) {
  const scrambleChars = useScrambleText(ROTATING_WORDS, INITIAL_PAUSE_MS, PAUSE_MS)
  return (
    <section className="px-7 py-[100px] text-center md:py-[150px]">
      <div className="mx-auto max-w-[1060px]">
        <div className="animate-[fadeInUp_0.8s_ease_both]">
          <h1 className="font-serif2026 text-[clamp(3rem,6.5vw,5.2rem)] font-normal leading-[1.08] tracking-tight">
            {HERO_WORDS.map(({ label, variant }, i) => (
              <span key={variant}>
                {i > 0 && ', '}
                <button
                  className="cursor-pointer border-0 bg-transparent p-0 font-serif2026 text-[1em] font-normal leading-[inherit] tracking-[inherit] text-inherit decoration-h2026-muted/40 underline-offset-[6px] transition-all duration-200 hover:text-h2026-blue hover:underline"
                  onClick={() => onWordClick(variant)}
                  type="button"
                >
                  {label}
                </button>
              </span>
            ))}
            ,<br />
            Digital{' '}
            <span className="inline-block min-w-[5.5em] text-left">
              {scrambleChars.map(({ char, resolved }, i) => (
                <span
                  className={resolved ? 'inline-block opacity-100 blur-0' : 'inline-block opacity-50 blur-[1.5px]'}
                  key={i}
                  style={{ transition: 'opacity 180ms ease, filter 180ms ease' }}
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>
          <span className="mt-5 block font-sans text-[clamp(0.85rem,1.6vw,1.05rem)] font-semibold uppercase tracking-widest text-h2026-blue">
            even for the highest stakes
          </span>
        </div>
        <p className="mx-auto mb-12 mt-7 max-w-[460px] text-[1.05rem] font-light leading-[1.65] text-h2026-textSecondary animate-[fadeInUp_0.8s_0.15s_ease_both]">
          100,000+ vote selections,
          <br />
          by voters from 330 cities across 25 countries.
        </p>
        <Link
          className="group inline-flex items-center gap-2.5 rounded-full bg-h2026-green px-10 py-4 text-[0.92rem] font-medium text-white no-underline shadow-h2026-cta transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-h2026-cta-hover animate-[fadeInUp_0.8s_0.3s_ease_both]"
          href="/admin"
        >
          Start a Vote
          <svg
            className="transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="16"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

function useScrambleText(words: string[], initialPauseMs: number, pauseMs: number) {
  const [chars, setChars] = useState<CharState[]>(() =>
    words[0].split('').map((char) => ({ char, resolved: true })),
  )
  const indexRef = useRef(0)
  const firstRun = useRef(true)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let interval: ReturnType<typeof setInterval>

    function transition() {
      const nextIndex = (indexRef.current + 1) % words.length
      const target = words[nextIndex]
      let tick = 0

      interval = setInterval(() => {
        tick++
        const resolvedCount = Math.floor(tick / FRAMES_PER_CHAR)

        if (resolvedCount >= target.length) {
          clearInterval(interval)
          setChars(target.split('').map((char) => ({ char, resolved: true })))
          indexRef.current = nextIndex
          timeout = setTimeout(transition, pauseMs)
          return
        }

        setChars(
          target.split('').map((char, i) =>
            i < resolvedCount
              ? { char, resolved: true }
              : { char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)], resolved: false },
          ),
        )
      }, FRAME_MS)
    }

    const delay = firstRun.current ? initialPauseMs : pauseMs
    firstRun.current = false
    timeout = setTimeout(transition, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [words, initialPauseMs, pauseMs])

  return chars
}
