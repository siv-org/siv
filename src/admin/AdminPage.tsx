import Head from 'next/head'
import { useState } from 'react'

import { api } from '../api-helper'
import { public_key } from '../protocol/election-parameters'
import { AddPeople } from './AddPeople'
import { BallotDesigner } from './BallotDesigner'

export const AdminPage = (): JSX.Element => {
  const [pubKey, setPubKey] = useState(false)
  const [sentVotersInvite, setSentVotersInvite] = useState(false)
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
        <h2>Create new election</h2>
        <BallotDesigner />
        <AddPeople
          disabled={pubKey}
          message={`Trustees made pub key ${public_key.recipient.toString()}`}
          onClick={() => setPubKey(true)}
          type="trustees"
        />
        <AddPeople
          disabled={!pubKey || sentVotersInvite}
          message={!pubKey ? 'Waiting on Trustees to generate public key' : 'Sent.'}
          onClick={async () => {
            const voters = (document.getElementById('voters-input') as HTMLInputElement).value.split('\n')
            // Call backend endpoint
            const { status } = await api('invite-voters', { password: localStorage.password, voters })
            if (status === 401) {
              localStorage.removeItem('password')
              alert('Invalid Password')
            } else if (status === 200) {
              setSentVotersInvite(true)
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
      `}</style>
    </>
  )
}
