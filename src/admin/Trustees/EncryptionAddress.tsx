import { useStored } from '../useStored'

export const EncryptionAddress = () => {
  const { threshold_public_key } = useStored()

  if (!threshold_public_key) return null

  return (
    <div>
      Trustees created a private key for the encryption address {threshold_public_key}
      <style jsx>{`
        div {
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          padding: 8px;

          word-wrap: break-word;
        }
      `}</style>
    </div>
  )
}
