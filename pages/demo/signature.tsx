import { ESignScreen } from 'src/vote/esign/ESignScreen'

// No voter credentials: the real signature UI works, but submission stays disabled.
export default function SignaturePreview() {
  return <ESignScreen dispatch={() => {}} state={{ encoded: {}, encrypted: {}, plaintext: {}, randomizer: {} }} />
}
