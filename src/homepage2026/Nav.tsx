import Image from 'next/image'
import Link from 'next/link'

import logo from '../homepage/logo.png'

const NAV_LINKS: { cta?: boolean; href: string; label: string }[] = [
  { href: '/about', label: 'About' },
  { href: 'https://blog.siv.org', label: 'News' },
  { href: '/resources', label: 'How\u00A0It\u00A0Works' },
  { cta: true, href: '/admin', label: 'Login' },
]

const logoHeight = 18
const logoWidth = (50 / 23) * logoHeight

export function Nav() {
  return (
    <nav className="fixed left-1/2 top-4 z-[100] flex -translate-x-1/2 items-center sm:gap-9 gap-6 rounded-full border border-h2026-border bg-white/70 px-6 py-2.5 shadow-h2026-sm backdrop-blur-[24px]">
      <Link className="relative hidden leading-none no-underline sm:inline-block" href="/">
        <Image alt="SIV" height={logoHeight} src={logo} width={logoWidth} />
      </Link>
      <div className="flex gap-4 items-center sm:gap-7">
        {NAV_LINKS.map(({ cta, href, label }) =>
          cta ? (
            <Link
              className="rounded-full bg-h2026-green px-5 py-2 text-sm font-medium text-white no-underline transition-all duration-200 hover:scale-[1.03] hover:bg-h2026-greenHover"
              href={href}
              key={label}
            >
              {label}
            </Link>
          ) : (
            <Link
              className="text-[0.82rem] font-normal text-h2026-textSecondary no-underline transition-colors hover:text-h2026-text"
              href={href}
              key={label}
            >
              {label}
            </Link>
          ),
        )}
      </div>
    </nav>
  )
}
