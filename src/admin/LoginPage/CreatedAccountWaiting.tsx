import { useEffect } from 'react'
import { pusher } from 'src/pusher-helper'

import { attemptInitLoginCode } from './attemptInitLoginCode'

export const CreatedAccountWaiting = ({ email }: { email: string }) => {
  // Listen for 'approved'
  useEffect(() => {
    if (!pusher) return alert('Missing pusher')
    const channel = pusher.subscribe(`admin-${email}`)
    channel.bind('approved', attemptInitLoginCode)

    return () => channel.unsubscribe()
  }, [email])

  return (
    <section className="px-6 py-6 mt-6 rounded-xl border shadow-sm border-h26-border bg-white/60">
      <h2 className="font-serif26 text-[1.35rem] font-normal tracking-tight text-h26-text">Request received</h2>
      <p className="mt-3 text-[0.92rem] leading-[1.6] text-h26-textSecondary">
        You’ll receive an email notification when your account is approved and you can sign in.
      </p>
    </section>
  )
}
