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
    className="inline-flex gap-2 items-center px-5 py-3 text-sm font-medium text-white rounded-xl bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90"
    href={href}
    id={id}
  >
    <Icon className="w-4 h-4" /> {children}
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
    className="inline-flex gap-2 items-center px-5 py-3 text-sm font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    href={href}
  >
    <Icon className="w-4 h-4" /> {children}
  </a>
)
