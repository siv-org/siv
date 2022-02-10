import { G, RP } from './curve'
import { Cipher, Public_Key } from './shuffle'

export default function encrypt(public_key: Public_Key, randomizer: bigint, message: RP): Cipher {
  // Calculate our encrypted message
  const shared_secret = public_key.multiply(randomizer)
  const encrypted = message.add(shared_secret)

  // This unlock factor lets someone with the decryption key reverse the encryption
  const lock = G.multiply(randomizer)

  return { encrypted, lock }
}
