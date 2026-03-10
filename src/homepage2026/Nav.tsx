import Image from 'next/image'
import Link from 'next/link'

import logo from '../homepage/logo.png'

const NAV_LINKS: { cta?: boolean; text: string; url: string }[] = [
  { text: 'About', url: '/about' },
  { text: 'News', url: 'https://blog.siv.org' },
  { text: 'How\u00A0It\u00A0Works', url: '/resources' },
  { cta: true, text: 'Login', url: '/admin' },
]

export const logoRatio = 50 / 23
const logoHeight = 18

export function Nav() {
  return (
    <nav className="fixed left-1/2 top-4 z-[100] flex -translate-x-1/2 items-center sm:gap-9 gap-6 rounded-full border border-h26-border bg-white/70 px-6 py-2.5 shadow-h2026-sm backdrop-blur-[24px]">
      {/* Logo */}
      <Link className="hidden relative leading-none no-underline sm:inline-block" href="/">
        <Image alt="SIV" height={logoHeight} src={logo} width={logoRatio * logoHeight} />
      </Link>

      <div className="flex gap-4 items-center sm:gap-7">
        {NAV_LINKS.map(({ cta, text, url }) =>
          !cta ? (
            // Nav links
            <Link
              className="text-[0.82rem] font-normal text-h26-textSecondary no-underline transition-colors hover:text-h26-text"
              href={url}
              key={text}
            >
              {text}
            </Link>
          ) : (
            // Login button
            <Link
              className="rounded-full bg-h26-green px-5 py-2 text-sm font-medium text-white no-underline transition-all duration-200 hover:scale-[1.03] hover:bg-h26-greenHover"
              href={url}
              key={text}
            >
              {text}
            </Link>
          ),
        )}
      </div>
    </nav>
  )
}
