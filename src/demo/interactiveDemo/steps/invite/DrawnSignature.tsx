import { ESignScreen } from 'src/vote/esign/ESignScreen'

export function DrawnSignature({ onClose }: { onClose: () => void }) {
  return (
    <ESignScreen
      dispatch={() => {}}
      onSubmit={onClose}
      state={{ encoded: {}, encrypted: {}, plaintext: {}, randomizer: {} }}
    />
  )
}
