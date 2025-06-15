import Image from 'next/image'

import { EmailSignup } from './EmailSignup'
import { FooterDivider } from './FooterDivider'
import logo from './logo.png'

const email = 'team@siv.org'

const logoWidth = 70

export const Footer = (): JSX.Element => (
  <>
    <FooterDivider />

    <footer className="relative max-w-[1440px] mx-auto">
      {/* Email Signup & logo/contact row */}
      <div className="flex flex-col w-full gap-8 py-8 mt-36 md:mt-96 sm:py-12 md:flex-row md:items-start md:justify-between md:gap-0">
        {/* Left: Email Signup */}
        <EmailSignup />

        {/* Right: Brand Info */}
        <div className="flex flex-col items-center md:items-end gap-2 min-w-[180px] mt-6">
          {/* Logo */}
          <Image alt="SIV" height={(logoWidth * 219) / 482} src={logo} width={logoWidth} />

          {/* Pronunciation */}
          <p className="!m-0 text-sm tracking-[0.1em] text-gray-500">(like civilization)</p>

          {/* Contact email */}
          <a
            className="mt-10 text-sm tracking-wide text-gray-500 transition-colors duration-200 hover:text-gray-800"
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </div>
      </div>

      {/* Copyright line */}
      <div className="w-full py-6 text-[11px] tracking-widest text-center text-gray-400 border-t border-gray-100">
        SIV © 2020–{new Date().getFullYear()}
      </div>
    </footer>
  </>
)
