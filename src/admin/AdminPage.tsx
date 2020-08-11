import Head from 'next/head'
import { useState } from 'react'

import { AddPeople } from './AddPeople'
import { BallotDesigner } from './BallotDesigner'

export const AdminPage = (): JSX.Element => {
  const [pubKey, setPubKey] = useState(false)
  return (
    <>
      <Head>
        <title>SIV: Admin</title>
        <link href="/favicon.png" rel="icon" />
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
        <meta content="/preview.png" property="og:image" />
      </Head>

      <main>
        <h1>SIV Admin</h1>
        <BallotDesigner />
        <AddPeople disabled={pubKey} onClick={() => setPubKey(true)} type="trustees" />
        <AddPeople
          disabled={!pubKey}
          onClick={async () => {
            // Call backend endpoint
            const { status } = await fetch('/api/invite-voters', {
              body: JSON.stringify({
                password: localStorage.password,
              }),
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              method: 'POST',
            })
            if (status === 401) {
              localStorage.removeItem('password')
              alert('Invalid Password')
            }
          }}
          type="voters"
        />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 2rem auto;
          padding: 1rem;
        }
      `}</style>

      <style global jsx>{`
        body {
          color: #222;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
            Droid Sans, Helvetica Neue, sans-serif;
          font-size: 0.875rem;
          letter-spacing: 0.01071em;
          line-height: 1.43;

          max-width: 100%;
        }

        a {
          color: #0070f3;
          text-decoration: none;
        }

        a:hover,
        a:focus,
        a:active {
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
