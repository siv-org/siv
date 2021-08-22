import { useDecryptedVotes } from 'src/status/use-decrypted-votes'

import { DownloadAllButton } from './DownloadAllButton'
import { EmbeddedPdf } from './EmbeddedPdf'

export const MarkedBallots = () => {
  const votes = useDecryptedVotes()

  return (
    <>
      <h2>Marked Ballots</h2>
      <div>
        This shows printing votes onto a sample ballot design.
        <p>
          Please contact <a href="mailto:help@secureinternetvoting.org">help@secureinternetvoting.org</a> to configure
          SIV with your existing ballot equipment.
        </p>
      </div>
      {!votes?.length ? (
        <>
          <p>There are no Unlocked votes yet.</p>
          <p>
            You can unlock votes from the <b>Voters</b> tab.
          </p>
        </>
      ) : (
        <>
          <DownloadAllButton {...{ votes }} />
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
