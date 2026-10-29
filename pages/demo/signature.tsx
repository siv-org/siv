import { ESignScreen } from 'src/vote/esign/ESignScreen'

// No voter credentials: real submission stays disabled; the invitation preview makes Submit close the example.
export default function SignaturePreview() {
  return <ESignScreen dispatch={() => {}} state={{ encoded: {}, encrypted: {}, plaintext: {}, randomizer: {} }} />
}
