import { use_stored_info } from '../load-existing'

export const EncryptionAddress = () => {
  const { threshold_public_key } = use_stored_info()

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
          width: 100%;

          word-wrap: break-word;
        }
      `}</style>
    </div>
  )
}
