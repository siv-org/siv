import Head from 'next/head'
import { useState } from 'react'

import { EncryptionReceipt } from './EncryptionReceipt'
import { Intro } from './Intro'
import { Question } from './Question'

export const DemoElection = (): JSX.Element => {
  const [plaintext, setPlaintext] = useState('')
  return (
    <>
      <Head>
        <title>SIV: Demo Election</title>
        <link href="/favicon.png" rel="icon" />
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
        <meta content="/preview.png" property="og:image" />
      </Head>

      <main>
        <h1>Demo Election</h1>
        <Intro />
        <Question plaintext={plaintext} setPlaintext={setPlaintext} />
        <EncryptionReceipt
          state={{
            encrypted: { best_icecream: '1234', secret: '1235' },
            plaintext: { best_icecream: plaintext, secret: 'foobar' },
            randomizer: { best_icecream: '1234', secret: '1235' },
          }}
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
