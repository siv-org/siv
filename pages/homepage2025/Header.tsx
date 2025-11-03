import { Code, LogIn } from 'lucide-react'
import React from 'react'

import { BlackButton, WhiteButton } from './Buttons'

export const HeaderBar = () => {
  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur bg-white/70 dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-800">
      <div className="container flex justify-between items-center px-4 mx-auto max-w-7xl h-16">
        <div className="flex gap-3 items-center">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">SIV</span>
        </div>
        <nav className="hidden gap-6 items-center text-sm md:flex">
          <a className="no-underline text-zinc-900 dark:text-zinc-100 hover:opacity-80" href="#how">
            How it works
          </a>
          <a className="no-underline text-zinc-900 dark:text-zinc-100 hover:opacity-80" href="#security">
            Security
          </a>
          <a className="no-underline text-zinc-900 dark:text-zinc-100 hover:opacity-80" href="#compare">
            Contributors
          </a>
          <a className="no-underline text-zinc-900 dark:text-zinc-100 hover:opacity-80" href="#demo">
            Live Demo
          </a>
        </nav>
        <div className="flex gap-3 items-center">
          <WhiteButton className="!px-4 !py-2 text-sm !rounded-md" href="https://hack.siv.org" icon={Code}>
            Hack SIV
          </WhiteButton>
          <BlackButton className="!px-4 !py-2 text-sm !rounded-md" href="https://siv.org/login" icon={LogIn}>
            Log In
          </BlackButton>
        </div>
      </div>
    </header>
  )
}
