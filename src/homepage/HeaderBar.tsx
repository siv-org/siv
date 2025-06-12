import Link from 'next/link'

export const HeaderBar = () => (
  <header className="w-full px-6 py-6 mx-auto border-b border-gray-200 max-w-7xl sm:px-8 lg:px-10 bg-gradient-to-r from-white via-gray-100 to-white">
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <h3 className="m-0">
        <Link href="/">
          <a className="text-4xl font-bold tracking-tight text-transparent transition-all duration-200 bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text hover:opacity-80">
            SIV
          </a>
        </Link>
      </h3>
      <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
        <Link href="https://docs.siv.org">
          <a className="px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 rounded-lg hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm">
            Docs
          </a>
        </Link>
        <Link href="https://blog.siv.org">
          <a className="px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 rounded-lg hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm">
            Blog
          </a>
        </Link>
        <Link href="/faq">
          <a className="px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 rounded-lg hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm">
            FAQ
          </a>
        </Link>
        <Link href="/about">
          <a className="px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 rounded-lg hover:bg-gray-50/80 hover:text-gray-900 hover:shadow-sm">
            Research
          </a>
        </Link>
        <Link href="/admin">
          <a className="px-4 py-2 text-sm font-medium text-indigo-900 transition-all duration-200 border rounded-lg shadow-md bg-white/60 bg-gradient-to-r from-indigo-100/60 to-white/60 backdrop-blur-md border-white/50 hover:bg-white/80 hover:from-indigo-200/80 hover:shadow-lg">
            Sign In
          </a>
        </Link>
      </nav>
    </div>
  </header>
)
