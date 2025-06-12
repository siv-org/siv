import { EmailSignup } from './EmailSignup'

const email = 'team@siv.org'

export const Footer = (): JSX.Element => (
  <footer>
    <div className="flex flex-col w-full gap-8 px-4 py-8 sm:px-6 sm:py-12 md:flex-row md:items-end md:justify-between md:gap-0">
      {/* Left: Email Signup */}
      <div className="flex-1 min-w-[220px] md:pr-8 flex flex-col items-center md:items-start text-center md:text-left gap-4">
        <EmailSignup />
      </div>
      {/* Right: Brand Info */}
      <div className="flex flex-col items-center md:items-end text-center md:text-right gap-1 min-w-[180px]">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">SIV</h3>
        <p className="text-base text-gray-500 sm:text-lg">“SIV”, like civilization</p>
        <a
          href={`mailto:${email}`}
          className="mt-1 text-base font-medium text-gray-900 transition-colors hover:text-gray-600"
        >
          {email}
        </a>
      </div>
    </div>
    <div className="w-full py-3 mt-2 text-xs text-center text-gray-400 border-t border-gray-100">
      © {new Date().getFullYear()} SIV. All rights reserved.
    </div>
  </footer>
)
