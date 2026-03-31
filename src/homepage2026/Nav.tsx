import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import logo from '../homepage/logo.png'

const NAV_LINKS: { cta?: boolean; text: string; url: string }[] = [
  { text: 'About', url: '/about' },
  { text: 'News', url: 'https://blog.siv.org' },
  { text: 'How\u00A0It\u00A0Works', url: '/resources' },
  { cta: true, text: 'Login', url: '/login' },
]

export const logoRatio = 50 / 23
const logoHeight = 18

export function Nav() {
  const router = useRouter()
  const isLoginPage = router.pathname === '/login' || router.pathname === '/enter-login-code'

  return (
    <nav className="fixed left-1/2 top-4 z-[100] flex -translate-x-1/2 items-center gap-4 sm:gap-9 rounded-full border border-h26-border bg-white/70 px-4 sm:px-6 py-2.5 shadow-sm backdrop-blur-[24px]">
      {/* Logo */}
      <Link
        aria-label="Go to homepage"
        className="inline-flex relative justify-center items-center w-10 h-10 no-underline shrink-0 min-[890px]:inline-block min-[890px]:h-auto min-[890px]:w-auto"
        href="/"
      >
        <Image
          alt="SIV"
          className="h-[14px] w-auto min-[890px]:h-[18px]"
          height={logoHeight}
          src={logo}
          width={logoRatio * logoHeight}
        />
      </Link>

      <div className="flex gap-3 items-center sm:gap-7">
        {NAV_LINKS.map(({ cta, text, url }) =>
          !cta ? (
            // Nav links
            <Link
              className={`text-[0.82rem] font-normal text-h26-textSecondary no-underline transition-colors hover:text-h26-text border-y-2 border-transparent px-0.5 ${
                url.startsWith('/') && router.pathname === url ? 'border-b-green-700/40' : ''
              }`}
              href={url}
              key={text}
            >
              {text}
            </Link>
          ) : (
            // Login button — outlined on login page so it's less prominent
            <Link
              className={`rounded-full px-[18px] py-1.5 text-sm font-medium no-underline transition-all duration-200 border-2 ${
                isLoginPage
                  ? 'border-h26-green bg-white text-h26-green hover:bg-h26-green/5'
                  : 'border-transparent bg-h26-green text-white hover:scale-[1.03] hover:bg-h26-greenHover'
              }`}
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
