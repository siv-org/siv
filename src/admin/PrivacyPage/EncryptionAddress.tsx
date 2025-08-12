import { Button } from 'src/_shared/Button'

import { useStored } from '../useStored'

export const EncryptionAddress = () => {
  const { election_id, threshold_public_key, trustees } = useStored()

  if (!threshold_public_key || !trustees) return null

  return (
    <>
      <div>
        {trustees.length > 1 ? (
          <>
            <h4>✅ The Privacy Protectors completed the Pre-Election setup.</h4>
            They created a Multi-Party Unlocking Key for the encryption address:
          </>
        ) : (
          <>
            <h4>No extra Privacy Protectors were added.</h4>✅ Election Unlocking Key created, for encryption address:
          </>
        )}
        <span>{threshold_public_key}</span>
        <p>Votes can now be accepted.</p>
      </div>
      <Button href={`/admin/${election_id}/voters`} style={{ marginLeft: 0, marginTop: 30 }}>
        Step 3: Add Voters
      </Button>
      <style jsx>{`
        div {
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          padding: 10px;

          margin-top: 45px;

          word-wrap: break-word;
        }

        h4 {
          margin-top: 0;
        }

        span {
          display: block;

          font-size: 11px;
        }

        p {
          margin-bottom: 0;
        }
      `}</style>
    </>
  )
}
