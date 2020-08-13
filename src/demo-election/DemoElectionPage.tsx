import { map } from 'lodash-es'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import { encode } from '../protocol/crypto/encode'
import encrypt from '../protocol/crypto/encrypt'
import pickRandomInteger from '../protocol/crypto/pick-random-integer'
import { Big, big } from '../protocol/crypto/types'
import { public_key } from '../protocol/election-parameters'
import { EncryptionReceipt } from './EncryptionReceipt'
import { Intro } from './Intro'
import { Question } from './Question'
import { SubmitButton } from './SubmitButton'
import { YourAuthToken } from './YourAuthToken'

export const DemoElectionPage = (): JSX.Element => {
  const [plaintext, setPlaintext] = useState('')
  const random = pickRandomInteger(public_key.modulo)
  const encrypted = encrypt(public_key, random, big(encode(plaintext)))
  const encryptedString = `{ \n${map(
    encrypted,
    (value: Big, key) => `${key}: ${value.toString().padStart(public_key.modulo.toString().length, '0')}`,
  ).join(',\n\t ')} \n}`

  const [authToken, setAuthToken] = useState<string>()
  const [electionId, setElectionId] = useState<string>()

  // Grab values from URL querystring
  useEffect(() => {
    const query_string = window.location.href.split('?')[1]
    const terms = query_string?.split('&')
    terms?.forEach((term) => {
      const [key, value] = term.split('=')
      if (key === 'auth') {
        setAuthToken(value)
      }
      if (key === 'election') {
        setElectionId(value)
      }
    })
  }, [])

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
        <YourAuthToken {...{ authToken, electionId }} />
        <Question {...{ plaintext }} setPlaintext={setPlaintext} />
        <SubmitButton {...{ authToken, electionId, encryptedString }} />
        <EncryptionReceipt
          state={{
            encrypted: { best_icecream: encryptedString },
            plaintext: { best_icecream: plaintext },
            randomizer: { best_icecream: random.toString() },
          }}
        />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
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
