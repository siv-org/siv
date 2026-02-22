import type { ReactNode } from 'react'

export type ModalVariant = 'easy' | 'safe' | 'smart'

export const MODAL_CONTENT: Record<ModalVariant, { kicker: string; title: string; content: ReactNode }> = {
  easy: {
    kicker: 'Easy',
    title: 'Voting should be effortless.',
    content: (
      <>
        <p>
          SIV works on any device with a browser — phone, tablet, laptop. No special software, no downloads, no trip
          to a polling station.
        </p>
        <p>
          Voters authenticate with methods they already know, receive their ballot digitally, and cast their vote in
          minutes. <span className="font-medium text-h2026-text">The entire experience is designed to feel as simple as sending a message.</span>
        </p>
        <p>Behind that simplicity is serious infrastructure — but the voter never has to think about it.</p>
      </>
    ),
  },
  safe: {
    kicker: 'Safe',
    title: 'Mathematically proven, not just promised.',
    content: (
      <>
        <p>
          SIV uses <span className="font-medium text-h2026-text">end-to-end verifiability</span>: every voter can independently confirm their vote was cast as
          intended, recorded as cast, and counted as recorded.
        </p>
        <p>
          Cryptographic proofs — including zero-knowledge proofs and homomorphic encryption — ensure votes can be
          verified without ever being revealed. <span className="font-medium text-h2026-text">You don't have to trust the system. You can verify it yourself.</span>
        </p>
        <p>
          SIV was red-teamed at DEF CON by the world's top security researchers, and has deployed anti-coercion
          technology that protects voters from influence and intimidation.
        </p>
      </>
    ),
  },
  smart: {
    kicker: 'Smart',
    title: 'Built for the future of democracy.',
    content: (
      <>
        <p>
          SIV doesn't just digitize paper voting — it rethinks what's possible.{' '}
          <span className="font-medium text-h2026-text">Smart ballot design, real-time auditability, and transparent tallying</span> make elections more
          accountable than ever before.
        </p>
        <p>
          The platform adapts to any election type — from board votes to national referendums — with configurable rules,
          multi-language support, and accessibility built in.
        </p>
        <p>
          SIV has already powered the largest digital vote in US history, with 100,000+ vote selections across 330 cities
          in 25 countries.
        </p>
      </>
    ),
  },
}
