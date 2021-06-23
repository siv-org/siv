import { useState } from 'react'
import useSWR from 'swr'

import { BillingStats } from '../../pages/api/admin-get-billing-stats'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { useLoginRequired, useUser } from './auth'
import { CollapsibleSection } from './CollapsibleSection'
import { HeaderBar } from './HeaderBar'

export const BillingPage = (): JSX.Element => {
  const { loading, loggedOut } = useUser()
  const [show_add_credits, set_show_add_credits] = useState(false)

  useLoginRequired(loggedOut)

  const { data } = useSWR('/api/admin-get-billing-stats')

  if (loading || loggedOut) return <p style={{ fontSize: 21, padding: '1rem' }}>Loading...</p>

  if (!data) {
    return <>Loading...</>
  }

  const { credits_on_hold, credits_remaining, credits_used, history, num_total_elections } = data as BillingStats

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
          <b>Credits on hold: </b>
          {credits_on_hold}
        </p>
        <label>When elections close and stop accepting new votes, credits on hold are returned.</label>
        <br />
        <br />
        <p>
          <b>Total votes collected: </b>
          {credits_used}
        </p>
        <label>
          You&apos;ve run <i>{num_total_elections}</i> elections, with an average of{' '}
          <i>{Math.round(credits_used / num_total_elections)}</i> votes each.
        </label>

        <br />
        <br />
        <br />
        <br />
        <CollapsibleSection title="Billing History">
          <table>
            <thead>
              <tr>
                <th>date</th>
                <th>type</th>
                <th># credits</th>
                <th className="left">description</th>
              </tr>
            </thead>

            <tbody>
              {history.map(({ amount, date, description, type }, index) => (
                <tr key={index}>
                  <td>{new Date(date).toDateString()}</td>
                  <td>{type}</td>
                  <td className={type === 'usage' ? 'red' : 'green'}>{amount}</td>
                  <td className="left">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleSection>
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

        label i {
          color: #000d;
        }

        h3 {
          margin-top: 3rem;
        }

        table {
          border-spacing: 25px 5px;
        }

        th,
        td {
          text-align: right;
        }

        th.left,
        td.left {
          text-align: left;
        }

        td.red {
          background-color: #ffdbdb;
        }

        td.green {
          background-color: #b2e099;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
