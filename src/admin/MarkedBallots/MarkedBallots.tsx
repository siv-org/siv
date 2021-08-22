import { useDecryptedVotes } from 'src/status/use-decrypted-votes'

import { DownloadAllButton } from './DownloadAllButton'
import { EmbeddedPdf } from './EmbeddedPdf'

export const MarkedBallots = () => {
  const votes = useDecryptedVotes()

  return (
    <>
      <h2>Marked Ballots</h2>
      {!votes?.length ? (
        <>
          <p>There are no Unlocked votes yet.</p>
          <p>
            You can unlock votes from the <b>Voters</b> tab.
          </p>
        </>
      ) : (
        <>
          <DownloadAllButton />
          {votes.map((vote, index) => (
            <div key={index}>
              {/* <p key={vote.verification}>{JSON.stringify(vote)}</p> */}
              <EmbeddedPdf {...{ index, vote }} />
            </div>
          ))}
        </>
      )}
    </>
  )
}
