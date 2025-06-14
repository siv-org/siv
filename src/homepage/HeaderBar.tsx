import Image from 'next/image'
import Link from 'next/link'

import logo from './logo.png'

const logoWidth = 50
const sharedStyles =
  'px-4 py-2 text-base font-medium transition duration-75 rounded-lg hover:no-underline text-indigo-900 active:bg-indigo-200'

export const HeaderBar = () => {
  return (
    <header className="w-full px-6 py-6 mx-auto border-b border-gray-200 max-w-7xl sm:px-8 lg:px-10 bg-gradient-to-r from-white via-gray-100 to-white">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h3 className="m-0 hover:opacity-80 active:opacity-60">
          <Link href="/">
            <a className="leading-none">
              <Image alt="SIV" height={(logoWidth * 219) / 482} src={logo} width={logoWidth} />
            </a>
          </Link>
        </h3>
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {[
            ['Docs', 'https://docs.siv.org'],
            ['Blog', 'https://blog.siv.org'],
            ['FAQ', '/faq'],
            ['Research', '/about'],
          ].map(([label, href]) => (
            <Link href={href} key={label}>
              <a className={`${sharedStyles} hover:bg-indigo-100/80`}>{label}</a>
            </Link>
          ))}
          <Link href="/admin">
            <a
              className={`${sharedStyles} shadow bg-gradient-to-b from-indigo-100/60 to-white/60 hover:from-indigo-200/80`}
            >
              Sign In
            </a>
          </Link>
        </nav>
      </div>
    </header>
  )
}
