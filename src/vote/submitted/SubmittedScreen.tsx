import { NoSsr } from '@material-ui/core'
import { flatten } from 'lodash-es'
import Link from 'next/link'
import { useEffect } from 'react'

import { State } from '../vote-state'
import { DetailedEncryptionReceipt } from './DetailedEncryptionReceipt'
import { EncryptedVote } from './EncryptedVote'
import { UnlockedVote } from './UnlockedVote'

export function SubmittedScreen({
  auth,
  election_id,
  state,
}: {
  auth: string
  election_id: string
  state: State & { submitted_at: Date }
}): JSX.Element {
  // Widen the page for the tables
  useEffect(() => {
    const mainEl = document.getElementsByTagName('main')[0]
    if (mainEl) {
      mainEl.style.maxWidth = '880px'
    }
  })

  const columns = flatten(
    state.ballot_design?.map(({ id, multiple_votes_allowed }) => {
      return multiple_votes_allowed
        ? new Array(multiple_votes_allowed).fill('').map((_, index) => `${id || 'vote'}_${index + 1}`)
        : id || 'vote'
    }),
  )

  return (
    <NoSsr>
      <Link href={`/election/${election_id}`}>
        <a id="status-page" target="_blank">
          <img src="/vote/externallinkicon.jpg" width="12px" />
          Click here to visit the Election Status page.
        </a>
      </Link>

      <h3>How to verify your vote:</h3>
      <p>
        Once the election closes and votes are unlocked, you can verify your vote by finding it on the{' '}
        <Link href={`/election/${election_id}`}>
          <a style={{ color: 'black' }} target="_blank">
            Election Status page
          </a>
        </Link>{' '}
        using its <em>Verification #</em>:
      </p>

      <UnlockedVote {...{ columns, state }} />
      <p className="small grey">
        This secret <em>Verification #</em> is a random number, generated and encrypted on your own device.
        <br />
        No one else can possibly know it.
      </p>

      <br />
      <br />

      <h3>How your vote was submitted:</h3>

      <p>
        <img id="lock-icon" src="/vote/lock.png" width="12px" />
        To protect your privacy, your vote was encrypted:
      </p>

      <EncryptedVote {...{ auth, columns, state }} />
      <DetailedEncryptionReceipt {...{ state }} />

      <p className="small grey">
        Its contents will only be unlocked after the election closes and all votes have been shuffled for safe
        anonymization.
      </p>

      <style jsx>{`
        #lock-icon {
          margin-right: 7px;
          position: relative;
          top: 3px;
          opacity: 0.8;
        }

        #status-page {
          margin: 1rem 0 3rem;
          display: block;
          font-weight: bold;
        }

        #status-page img {
          margin-right: 7px;
          position: relative;
          top: 1px;
          opacity: 0.8;
        }

        .small {
          font-size: 12px;
        }

        .grey {
          opacity: 0.6;
        }
      `}</style>
    </NoSsr>
  )
}
