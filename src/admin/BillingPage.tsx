import { useState } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { useLoginRequired, useUser } from './auth'
import { HeaderBar } from './HeaderBar'

const credits_pending = 36
const credits_used = 320
const credits_remaining = 1000 - credits_used - credits_pending
const num_total_elections = 6

export const BillingPage = (): JSX.Element => {
  const { loading, loggedOut } = useUser()
  const [show_add_credits, set_show_add_credits] = useState(false)

  useLoginRequired(loggedOut)

  if (loading || loggedOut) return <p style={{ fontSize: 21, padding: '1rem' }}>Loading...</p>

  return (
    <>
      <Head title="Billing" />

      <HeaderBar />
      <main>
        <h1>Billing</h1>
        <br />
        <p>
          <b>Unused credits: </b>
          {credits_remaining}{' '}
        </p>
        <label>
          <a
            onClick={() => {
              set_show_add_credits(!show_add_credits)
            }}
          >
            Add more credits
          </a>{' '}
          to your account.
          {show_add_credits && (
            <>
              <br />
              Coming soon.
            </>
          )}
        </label>
        <br />
        <br />
        <p>
          <b>Pending credits: </b>
          {credits_pending}
        </p>
        <label>When elections close and stop accepting new votes, pending credits are refunded.</label>
        <br />
        <br />
        <p>
          <b>Total votes collected: </b>
          {credits_used}
        </p>
        <label>
          You&apos;ve run {num_total_elections} elections, with an average of{' '}
          <i>{Math.round(credits_used / num_total_elections)}</i> votes each.
        </label>
      </main>

      <style jsx>{`
        main {
          max-width: 775px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        h1 {
          font-size: 22px;
        }

        label {
          color: #0007;
        }

        label a {
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
