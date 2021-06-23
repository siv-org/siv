import { useState } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { useLoginRequired, useUser } from './auth'
import { CollapsibleSection } from './CollapsibleSection'
import { HeaderBar } from './HeaderBar'

const credits_pending = 36
const credits_used = 320
const credits_remaining = 1000 - credits_used - credits_pending
const num_total_elections = 6
const history = [
  {
    amount: '100',
    date: '6/3/2021',
    description: 'Purchased for $200',
    type: 'purchase',
  },
  {
    amount: '-70',
    date: '5/27/2021',
    description: 'Used in *San Francisco Election*',
    type: 'usage',
  },
  {
    amount: '100',
    date: '5/26/2021',
    description: 'From David Ernst: "Enjoy!"',
    type: 'grant',
  },
]

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
          <b>Credits on hold: </b>
          {credits_pending}
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
                  <td>{date}</td>
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
