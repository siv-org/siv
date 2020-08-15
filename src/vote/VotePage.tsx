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

  const { auth, election_id } = useRouter().query as NodeJS.Dict<string>

  return (
    <>
      <Head title="Demo Election" />

      <main>
        <h1>Demo Election</h1>
        <Intro />
        <YourAuthToken {...{ auth, election_id }} />
        <Question {...{ plaintext }} setPlaintext={setPlaintext} />
        <SubmitButton {...{ auth, election_id, encrypted }} disabled={!plaintext || plaintext === ''} />
        <EncryptionReceipt
          state={{
            encrypted: { best_icecream: encrypted },
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
