import Image from 'next/image'
import Link from 'next/link'

import logo from '../homepage/logo.png'
import { logoRatio } from './Nav'
import { ScrollReveal } from './ScrollReveal'

const COLUMNS: { links: { href: string; label: string }[]; title: string }[] = [
  {
    links: [
      { href: '/admin', label: 'Start a Vote' },
      { href: '/admin', label: 'Login' },
    ],
    title: 'Product',
  },
  {
    links: [
      { href: '/about', label: 'About' },
      { href: 'https://blog.siv.org', label: 'News' },
      { href: '/faq', label: 'FAQ' },
    ],
    title: 'Company',
  },
  {
    links: [
      { href: '/resources', label: 'How It Works' },
      { href: 'https://hack.siv.org', label: 'Security' },
      { href: 'https://docs.siv.org', label: 'Docs' },
    ],
    title: 'Resources',
  },
]

const logoHeight = 20

export function Footer() {
  return (
    <footer className="px-7 pb-8">
      <ScrollReveal className="mx-auto max-w-[1060px] border-t border-h2026-border pt-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="shrink-0">
            <Link className="no-underline" href="/">
              <Image alt="SIV" height={logoHeight} src={logo} width={logoRatio * logoHeight} />
            </Link>
            <p className="mt-3 max-w-[220px] text-[0.8rem] leading-[1.6] text-h2026-textSecondary">
              Easy, Safe, Smart.
              <br />
              team@siv.org
            </p>
          </div>

          <div className="flex flex-wrap gap-12 md:gap-16">
            {COLUMNS.map(({ links, title }) => (
              <div key={title}>
                <p className="mb-3 font-mono2026 text-[0.65rem] uppercase tracking-[0.2em] text-h2026-muted">{title}</p>
                <ul className="grid gap-2 pl-0 list-none">
                  {links.map(({ href, label }) => (
                    <li key={label}>
                      <Link
                        className="text-[0.82rem] text-h2026-textSecondary no-underline transition-colors hover:text-h2026-text"
                        href={href}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 mt-10">
          <p className="text-[0.72rem] text-h2026-muted text-left sm:text-center">
            &copy; 2020&ndash;{new Date().getFullYear()} SIV. All rights reserved.
          </p>
        </div>
      </ScrollReveal>
    </footer>
  )
}
