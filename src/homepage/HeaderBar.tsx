import Image from 'next/image'
import Link from 'next/link'

import logo from './logo.png'

const logoWidth = 50
const sharedStyles =
  'px-4 py-2 text-base font-medium transition duration-75 rounded-lg hover:no-underline text-indigo-900'

export const HeaderBar = () => {
  return (
    <header className="w-full px-6 py-6 mx-auto border-b border-gray-200 max-w-[1440px] sm:px-0.5 bg-gradient-to-r from-white via-gray-100 to-white flex flex-col items-center justify-between gap-4 sm:flex-row">
      {/* Logo */}
      <Link
        href="/"
        className="relative p-1.5 pt-2 pr-[5px] rounded-lg leading-none hover:bg-white hover:shadow top-px active:opacity-60 hover:border-gray-200 border border-solid border-transparent"
      >
        <Image alt="SIV" height={(logoWidth * 219) / 482} src={logo} width={logoWidth} />
      </Link>

      {/* Nav Links */}
      <nav className="flex flex-wrap gap-2 justify-center sm:gap-4">
        {[
          ['Docs', 'https://docs.siv.org'],
          ['Blog', 'https://blog.siv.org'],
          ['FAQ', '/faq'],
          ['Contributors', '/about'],
        ].map(([label, href]) => (
          <Link href={href} key={label} className={`${sharedStyles} hover:bg-gray-200 active:bg-gray-300`}>
            {label}
          </Link>
        ))}

        {/* Sign In Button */}
        <Link
          href="/admin"
          className={`bg-gradient-to-b shadow ${sharedStyles} from-indigo-100/60 to-white/60 hover:from-indigo-200/80 hover:to-indigo-100/50 active:bg-indigo-200`}
        >
          Sign In
        </Link>
      </nav>
    </header>
  )
}
