import { Big, Cipher_Text, Public_Key } from './types'

export default function decrypt(public_key: Public_Key, secret_key: Big, ciphertext: Cipher_Text): string {
  const { encrypted, unlock } = ciphertext
  const { modulo } = public_key

  const shared_secret = unlock.modPow(secret_key, modulo)
  const s_inverse = shared_secret.modInverse(modulo)
  const decrypted = encrypted.multiply(s_inverse).mod(modulo)

  return decrypted.toString()
}
