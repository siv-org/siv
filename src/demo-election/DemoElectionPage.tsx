import { map } from 'lodash-es'
import { useEffect, useState } from 'react'

import { encode } from '../crypto/encode'
import encrypt from '../crypto/encrypt'
import pickRandomInteger from '../crypto/pick-random-integer'
import { Big, big } from '../crypto/types'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
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
      <Head title="Demo Election" />

      <main>
        <h1>Demo Election</h1>
        <Intro />
        <YourAuthToken {...{ authToken, electionId }} />
        <Question {...{ plaintext }} setPlaintext={setPlaintext} />
        <SubmitButton {...{ authToken, electionId, encryptedString }} disabled={!plaintext || plaintext === ''} />
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
      <GlobalCSS />
    </>
  )
}
