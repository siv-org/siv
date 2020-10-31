import { useRouter } from 'next/router'
import { useState } from 'react'

import { encode } from '../crypto/encode'
import encrypt from '../crypto/encrypt'
import pickRandomInteger from '../crypto/pick-random-integer'
import { big } from '../crypto/types'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { public_key } from '../protocol/election-parameters'
import { EncryptionReceipt } from './EncryptionReceipt'
import { Intro } from './Intro'
import { Question } from './Question'
import { SubmitButton } from './SubmitButton'
import { YourAuthToken } from './YourAuthToken'

export const VotePage = (): JSX.Element => {
  const [plaintext, setPlaintext] = useState('')
  const random = pickRandomInteger(public_key.modulo)
  const encrypted = encrypt(public_key, random, big(encode(plaintext)))

  const max_string_length = Math.floor(public_key.modulo.bitLength() / 6)

  const { auth, election_id } = useRouter().query as NodeJS.Dict<string>

  return (
    <>
      <Head title="Cast Your Vote" />

      <main>
        <h1>Cast Your Vote</h1>
        <Intro />
        <YourAuthToken {...{ auth, election_id }} />
        <Question {...{ max_string_length, plaintext, setPlaintext }} />
        <SubmitButton {...{ auth, election_id, encrypted }} disabled={!plaintext || plaintext === ''} />
        <EncryptionReceipt
          state={{
            encrypted: { vote: encrypted },
            plaintext: { vote: plaintext },
            randomizer: { vote: random.toString() },
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
