import { useRouter } from 'next/router'
import { useState } from 'react'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { public_key } from '../protocol/election-parameters'
import { Ballot } from './Ballot'
import { EncryptionReceipt } from './EncryptionReceipt'
import { Footer } from './Footer'
import { SubmitButton } from './SubmitButton'
import { useVoteState } from './useVoteState'
import { YourAuthToken } from './YourAuthToken'

export const VotePage = (): JSX.Element => {
  // Initialize local vote state
  const [state, dispatch] = useVoteState()

  const [submission_status, setSubmissionStatus] = useState<string>()

  // Calculate maximum write-in string length
  const max_string_length = Math.floor(public_key.modulo.bitLength() / 6)

  // Grab election parameters from URL
  const { auth, election_id } = useRouter().query as NodeJS.Dict<string>

  return (
    <>
      <Head title="Cast Your Vote" />

      <main>
        {submission_status === 'Submitted.' ? (
          <>
            <h1>Vote Submitted.</h1>
            <EncryptionReceipt {...{ state }} />
          </>
        ) : (
          <>
            <h1>Cast Your Vote</h1>
            <YourAuthToken {...{ auth, election_id }} />
            <Ballot {...{ dispatch, election_id, max_string_length, state, submission_status }} />
            <SubmitButton {...{ auth, election_id, setSubmissionStatus, state, submission_status }} />
          </>
        )}
        <Footer />
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
