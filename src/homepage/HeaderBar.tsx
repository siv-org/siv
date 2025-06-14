import Link from 'next/link'

export const HeaderBar = () => {
  const sharedStyles =
    'px-4 py-2 text-base font-medium transition-all duration-75 rounded-lg hover:no-underline text-indigo-900'

  return (
    <header className="w-full px-6 py-6 mx-auto border-b border-gray-200 max-w-7xl sm:px-8 lg:px-10 bg-gradient-to-r from-white via-gray-100 to-white">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h3 className="m-0">
          <Link href="/">
            <a className="no-underline hover:no-underline text-4xl font-bold tracking-tight text-transparent transition-all duration-200 bg-gradient-to-r from-[#002868] to-[#003a8c] bg-clip-text active:from-[#003a8c] active:to-[#0049b3]">
              SIV
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
