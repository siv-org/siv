import Image from 'next/image'
import Link from 'next/link'

import logo from '../homepage/logo.png'
import { logoRatio } from './Nav'
import { ScrollReveal } from './ScrollReveal'

const COLUMNS: { group: string; links: { text: string; url: string }[] }[] = [
  {
    group: 'Product',
    links: [
      { text: 'Start a Vote', url: '/admin' },
      { text: 'Login', url: '/admin' },
    ],
  },
  {
    group: 'Company',
    links: [
      { text: 'About', url: '/about' },
      { text: 'News', url: 'https://blog.siv.org' },
      { text: 'FAQ', url: '/faq' },
    ],
  },
  {
    group: 'Resources',
    links: [
      { text: 'How It Works', url: '/resources' },
      { text: 'Security', url: 'https://hack.siv.org' },
      { text: 'Docs', url: 'https://docs.siv.org' },
    ],
  },
]

const logoHeight = 20

export function Footer() {
  return (
    <footer className="px-7 pb-8">
      <ScrollReveal className="mx-auto max-w-[1060px] border-t border-h26-border pt-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="shrink-0">
            <Link className="no-underline" href="/">
              <Image alt="SIV" height={logoHeight} src={logo} width={logoRatio * logoHeight} />
            </Link>
            <p className="mt-3 max-w-[220px] text-[0.8rem] leading-[1.6] text-h26-textSecondary">
              Easy, Safe, Smart.
              <br />
              team@siv.org
            </p>
          </div>

          <div className="flex flex-wrap gap-12 md:gap-16">
            {COLUMNS.map(({ group, links }) => (
              <div key={group}>
                <p className="mb-3 font-mono26 text-[0.65rem] uppercase tracking-[0.2em] text-h26-muted">{group}</p>
                <ul className="grid gap-2 pl-0 list-none">
                  {links.map(({ text, url }) => (
                    <li key={text}>
                      <Link
                        className="text-[0.82rem] text-h26-textSecondary no-underline transition-colors hover:text-h26-text"
                        href={url}
                      >
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 mt-10">
          <p className="text-[0.72rem] text-h26-muted text-left sm:text-center">
            &copy; 2020&ndash;{new Date().getFullYear()} SIV. All rights reserved.
          </p>
        </div>
      </ScrollReveal>
    </footer>
  )
}
