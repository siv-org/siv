import { NoSsr } from '@material-ui/core'
import Link from 'next/link'

import { State } from '../vote-state'
import { DetailedEncryptionReceipt } from './DetailedEncryptionReceipt'
import { EncryptedVote } from './EncryptedVote'
import { UnlockedVote } from './UnlockedVote'

export function SubmittedScreen({
  election_id,
  state,
}: {
  election_id: string
  state: State & { submitted_at: Date }
}): JSX.Element {
  return (
    <NoSsr>
      <p>
        <img id="lock-icon" src="/vote/lock.png" width="12px" />
        To protect your privacy, your vote was encrypted:
      </p>

      <EncryptedVote />

      <p>
        It&apos;s contents will only be unlocked once the election closes, after all votes have been shuffled for safe
        anonymization.
      </p>

      <Link href={`/election/${election_id}`}>
        <a id="status-page" target="_blank">
          <img src="/vote/externallinkicon.jpg" width="12px" />
          Click here to visit the Election status page.
        </a>
      </Link>

      <p>
        Before your vote was encrypted, this secret Tracking # was generated: <b>{state.tracking}</b>.
        <br /> It is a random number, generated on your own device. No one else can possibly know it.
      </p>
      <p>
        Once the election closes, you can <em>personally verify that your vote was counted correctly</em> by finding it
        with this tracking number:
      </p>

      <UnlockedVote />

      <DetailedEncryptionReceipt {...{ state }} />

      <style jsx>{`
        #lock-icon {
          margin-right: 7px;
          position: relative;
          top: 3px;
          opacity: 0.9;
        }

        #status-page {
          margin: 3rem 0;
          display: block;
          font-weight: bold;
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
