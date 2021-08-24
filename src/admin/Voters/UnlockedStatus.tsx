import { useDecryptedVotes } from 'src/status/use-decrypted-votes'

export const UnlockedStatus = () => {
  const votes = useDecryptedVotes()

  if (!votes || !votes.length) return null

  return (
    <div>
      <p>✅ Successfully unlocked {votes.length} votes.</p>
      <style jsx>{`
        div {
          border: 1px solid rgba(26, 89, 0, 0.66);
          background: rgba(0, 128, 0, 0.18);
          border-radius: 5px;

          padding: 10px;
          margin-bottom: 15px;
        }

        p {
          margin: 0;
        }

        a {
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
