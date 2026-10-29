import { ESignScreen } from 'src/vote/esign/ESignScreen'

// The explicit override closes the example without submitting a signature or requiring voter credentials.
export default function SignaturePreview() {
  return (
    <ESignScreen
      dispatch={() => {}}
      onSubmit={() => window.parent.postMessage({ type: 'siv-demo-signature-complete' }, window.location.origin)}
      state={{ encoded: {}, encrypted: {}, plaintext: {}, randomizer: {} }}
    />
  )
}
