import { mapValues } from 'lodash-es'
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
  const tracking = generateTrackingNum()
  const [vote_plaintext, setVotePlaintext] = useState('')
  const randomizer = { tracking: pickRandomInteger(public_key.modulo), vote: pickRandomInteger(public_key.modulo) }
  const encrypted = {
    tracking: encrypt(public_key, randomizer.tracking, big(encode(vote_plaintext))),
    vote: encrypt(public_key, randomizer.vote, big(encode(vote_plaintext))),
  }

  const max_string_length = Math.floor(public_key.modulo.bitLength() / 6)

  const { auth, election_id } = useRouter().query as NodeJS.Dict<string>

  return (
    <>
      <Head title="Cast Your Vote" />

      <main>
        <h1>Cast Your Vote</h1>
        <Intro />
        <YourAuthToken {...{ auth, election_id }} />
        <Question {...{ max_string_length, setVotePlaintext, vote_plaintext }} />
        <SubmitButton {...{ auth, election_id, encrypted }} disabled={!vote_plaintext || vote_plaintext === ''} />
        <EncryptionReceipt
          state={{
            encrypted,
            plaintext: { tracking, vote: vote_plaintext },
            randomizer: mapValues(randomizer, (r) => r.toString()),
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

function generateTrackingNum() {
  const random = Math.random()
  const integer = String(random).slice(2)
  const hex = Number(integer).toString(16)
  const id = `${hex.slice(0, 4)} ${hex.slice(4, 8)} ${hex.slice(8, 12)}`
  return id
}
