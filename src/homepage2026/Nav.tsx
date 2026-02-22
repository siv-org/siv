import Link from 'next/link'

const NAV_LINKS: { label: string; href: string; cta?: boolean }[] = [
  { label: 'People', href: '/about' },
  { label: 'News', href: '#news' },
  { label: 'Resources', href: '/faq' },
  { label: 'Login', href: '/admin', cta: true },
]

export function Nav() {
  return (
    <nav className="fixed left-1/2 top-4 z-[100] flex -translate-x-1/2 items-center gap-9 rounded-full border border-h2026-border bg-white/70 px-6 py-2.5 shadow-h2026-sm backdrop-blur-[24px]">
      <Link
        className="font-mono2026 text-[1.05rem] font-medium tracking-wider text-h2026-text no-underline"
        href="/"
      >
        SIV
      </Link>
      <div className="flex items-center gap-7">
        {NAV_LINKS.map(({ label, href, cta }) =>
          cta ? (
            <Link
              key={label}
              className="rounded-full bg-h2026-green px-5 py-2 text-sm font-medium text-white no-underline transition-all duration-200 hover:scale-[1.03] hover:bg-h2026-greenHover"
              href={href}
            >
              {label}
            </Link>
          ) : (
            <Link
              key={label}
              className="text-[0.82rem] font-normal text-h2026-textSecondary no-underline transition-colors hover:text-h2026-text"
              href={href}
            >
              {label}
            </Link>
          ),
        )}
      </div>
    </nav>
  )
}
