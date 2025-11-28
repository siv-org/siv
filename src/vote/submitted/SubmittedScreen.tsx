import Link from 'next/link'
import { useEffect, useReducer } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'

import { generateColumnNames } from '../generateColumnNames'
import { State } from '../vote-state'
import { DetailedEncryptionReceipt } from './DetailedEncryptionReceipt'
import { EncryptedVote } from './EncryptedVote'
import { InvalidatedVoteMessage } from './InvalidatedVoteMessage'
import { UnlockedVote } from './UnlockedVote'
import { UnverifiedEmailModal } from './UnverifiedEmailModal'

const disabledLinkToStatusPage = ['1764273267967', '1764288582801']

export function SubmittedScreen({
  auth,
  election_id,
  state,
}: {
  auth: string
  election_id: string
  state: State & { submitted_at: Date }
}): JSX.Element {
  const [showEncryptionDetails, toggleEncryptionDetails] = useReducer((state) => !state, false)

  // Widen the page for the tables
  useEffect(() => {
    const mainEl = document.getElementsByTagName('main')[0]
    if (mainEl) mainEl.style.maxWidth = '880px'
  })

  const { columns } = generateColumnNames({ ballot_design: state.ballot_design })

  return (
    <NoSsr>
      <UnverifiedEmailModal />
      <InvalidatedVoteMessage />

      {!disabledLinkToStatusPage.includes(election_id) && (
        <Link as={`/election/${election_id}`} href="/election/[election_id]" legacyBehavior>
          <a id="status-page" target="_blank">
            <img src="/vote/externallinkicon.jpg" width="15px" />
            Click here to visit the Election Status page.
          </a>
        </Link>
      )}

      <h3>How to verify your vote:</h3>
      <p>
        Once the election closes and votes are unlocked, you can find yours on the{' '}
        <Link as={`/election/${election_id}`} href="/election/[election_id]" legacyBehavior>
          <a style={{ color: 'black' }} target="_blank">
            Election Status page
          </a>
        </Link>{' '}
        using its <em>Verification #</em>:
      </p>

      <UnlockedVote {...{ columns, state }} />

      <p className="text-xs opacity-60">
        This secret <em>Verification #</em> is a random number, generated and encrypted on your own device.
        <br />
        No one else can possibly know it.
      </p>

      {/* Encryption */}
      <h3 className="mt-16">How your vote was submitted:</h3>

      <p>
        <img id="lock-icon" src="/vote/lock.png" width="12px" />
        To protect your privacy, your vote was encrypted before submission:
      </p>

      <EncryptedVote {...{ auth, columns, state }} />

      <p className="text-xs opacity-60">
        Its contents will only be unlocked after the election closes and all votes have been shuffled for safe
        anonymization.
      </p>

      <p className="mt-3 text-xs opacity-70">
        <a className="cursor-pointer" onClick={toggleEncryptionDetails}>
          {showEncryptionDetails ? '[-] Hide' : '[+] Show'} Encryption Details
        </a>
      </p>

      {showEncryptionDetails && (
        <>
          <h4>Encryption Receipt:</h4>

          <DetailedEncryptionReceipt {...{ auth, election_id, state }} />
        </>
      )}

      <style jsx>{`
        #lock-icon {
          margin-right: 7px;
          position: relative;
          top: 3px;
          opacity: 0.8;
        }

        #status-page {
          margin: 0 0 2rem;
          display: inline-block;
          font-weight: bold;
          font-size: 19px;
        }

        #status-page img {
          margin-right: 7px;
          position: relative;
          top: 1px;
          opacity: 0.8;
        }
      `}</style>
    </NoSsr>
  )
}
