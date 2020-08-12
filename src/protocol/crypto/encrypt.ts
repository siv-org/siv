import { Big, Cipher_Text, Public_Key } from './types'

export default function encrypt(public_key: Public_Key, randomizer: Big, encoded_message: Big): Cipher_Text {
  const { generator, modulo, recipient } = public_key

  // Calculate our encrypted message
  const shared_secret = recipient.modPow(randomizer, modulo)
  const message = encoded_message.multiply(shared_secret).mod(modulo)

  // This lets the recipient's private key reverse the encryption
  const unlock = generator.modPow(randomizer, modulo)

  return { message, unlock }
}
