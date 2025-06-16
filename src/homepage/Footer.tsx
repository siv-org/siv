import Image from 'next/image'

import { EmailSignup } from './EmailSignup'
import { FooterDivider } from './FooterDivider'
import logo from './logo.png'

const email = 'team@siv.org'

const logoWidth = 70

export const Footer = (): JSX.Element => (
  <>
    <FooterDivider />

    <footer className="max-w-[1440px] mx-auto">
      {/* Email Signup & logo/contact row */}
      <div className="flex flex-col mt-48 md:mt-96 md:flex-row md:justify-between">
        {/* Left: Email Signup */}
        <EmailSignup />

        {/* Right: Brand Info */}
        <div className="flex flex-col items-center text-sm md:items-end md:mt-9 mt-14">
          {/* Logo */}
          <Image alt="SIV" height={(logoWidth * 219) / 482} src={logo} width={logoWidth} />

          {/* Pronunciation */}
          <p className="mt-2 tracking-widest text-gray-500">(like civilization)</p>

          {/* Contact email */}
          <a
            className="mt-8 tracking-wide text-gray-500 transition md:mt-12 hover:text-gray-800"
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </div>
      </div>

      {/* Copyright line */}
      <div className="w-full mt-12 py-6 text-[11px] tracking-widest text-center text-gray-400 border-t border-gray-100">
        SIV © 2020–{new Date().getFullYear()}
      </div>
    </footer>
  </>
)
