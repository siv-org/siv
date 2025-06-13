import { EmailSignup } from './EmailSignup'

const email = 'team@siv.org'

export const Footer = (): JSX.Element => (
  <footer>
    <div className="flex flex-col w-full gap-8 px-4 py-8 mt-96 sm:px-6 sm:py-12 md:flex-row md:items-start md:justify-between md:gap-0">
      {/* Left: Email Signup */}
      <div className="flex-1 min-w-[220px] md:pr-8 flex flex-col items-center md:items-start text-center md:text-left gap-4">
        <EmailSignup />
      </div>
      {/* Right: Brand Info */}
      <div className="flex flex-col items-center md:items-end gap-1 min-w-[180px]">
        <h3 className="mb-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">SIV</h3>
        <p className="!m-0 text-sm tracking-[0.1em] text-gray-500">&quot;SIV&quot;, like civilization</p>
        <a
          className="mt-12 text-sm tracking-wide text-gray-500 transition-colors duration-200 hover:text-gray-800"
          href={`mailto:${email}`}
        >
          {email}
        </a>
      </div>
    </div>
    <div className="w-full py-6 text-[11px] tracking-widest text-center text-gray-400 border-t border-gray-100">
      © {new Date().getFullYear()} SIV. All rights reserved.
    </div>
  </footer>
)
