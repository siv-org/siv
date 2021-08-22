import { OnClickButton } from 'src/landing-page/Button'
import { useDecryptedVotes } from 'src/status/use-decrypted-votes'

import { PDF } from './PDF'

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
          <OnClickButton style={{ marginLeft: 0, padding: '6px 15px' }} onClick={() => {}}>
            Download All
          </OnClickButton>
          {votes.map((vote, index) => (
            <div key={index}>
              {/* <p key={vote.verification}>{JSON.stringify(vote)}</p> */}
              <PDF {...{ index, vote }} />
            </div>
          ))}
        </>
      )}
    </>
  )
}
