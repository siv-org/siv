import { useStored } from '../useStored'

export const EncryptionAddress = () => {
  const { threshold_public_key } = useStored()

  if (!threshold_public_key) return null

  return (
    <div>
      <h4>✅ The Verifying Observers completed the Pre-Election setup.</h4>
      They created a Multi-Party Unlocking Key for the encryption address:
      <span>{threshold_public_key}</span>
      <p>The election can now begin.</p>
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
    </div>
  )
}
