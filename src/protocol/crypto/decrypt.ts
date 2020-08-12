import { Big, Cipher_Text, Public_Key } from './types'

export default function decrypt(public_key: Public_Key, secret_key: Big, ciphertext: Cipher_Text): string {
  const { message, unlock } = ciphertext
  const { modulo } = public_key

  const shared_secret = unlock.modPow(secret_key, modulo)
  const s_inverse = shared_secret.modInverse(modulo)
  const decrypted = message.multiply(s_inverse).mod(modulo)

  return decrypted.toString()
}
