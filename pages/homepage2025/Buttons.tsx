import React from 'react'

export const BlackButton = ({
  children,
  href,
  icon: Icon,
  id,
}: {
  children: React.ReactNode
  href: string
  icon: React.ComponentType<{ className?: string }>
  id?: string
}) => (
  <a
    className="inline-flex gap-2 items-center px-6 py-4 font-medium text-white no-underline rounded-xl bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90"
    href={href}
    id={id}
  >
    <Icon className="w-5 h-5" /> {children}
  </a>
)

export const WhiteButton = ({
  children,
  href,
  icon: Icon,
}: {
  children: React.ReactNode
  href: string
  icon: React.ComponentType<{ className?: string }>
}) => (
  <a
    className="inline-flex gap-2 items-center px-6 py-4 text-base font-medium text-black no-underline bg-white rounded-xl border border-solid border-zinc-300 hover:bg-zinc-50"
    href={href}
  >
    <Icon className="w-5 h-5 text-black" /> {children}
  </a>
)
