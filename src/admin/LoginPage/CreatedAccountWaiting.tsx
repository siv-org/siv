import { useEffect } from 'react'
import { pusher } from 'src/pusher-helper'

import { attemptInitLoginCode } from './CreateAccount'
import { breakpoint } from './LoginPage'

export const CreatedAccountWaiting = ({ email }: { email: string }) => {
  // Listen for 'approved'
  useEffect(() => {
    if (!pusher) return alert('Missing pusher')
    const channel = pusher.subscribe(`admin-${email}`)
    channel.bind('approved', attemptInitLoginCode)

    return () => {
      channel.unsubscribe()
    }
  })

  return (
    <section>
      <h2>Your account info has been submitted.</h2>
      <p>You&apos;ll receive an email notification when you can login.</p>
      <style jsx>{`
        section {
          max-width: 410px;
        }

        h2 {
          font-size: 30px;
          font-weight: 600;
          margin-top: 0;
        }

        p {
          font-size: 20px;
        }

        @media (max-width: ${breakpoint}px) {
          section {
            padding-bottom: 3rem;
          }
        }
      `}</style>
    </section>
  )
}
