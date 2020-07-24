import { Big, Cipher_Text, Public_Key } from './types'

export default function decrypt(public_key: Public_Key, secret_key: Big, ciphertext: Cipher_Text): string {
  const { sealed_data, sealing_factor } = ciphertext
  const { modulo } = public_key

  const shared_secret = sealing_factor.modPow(secret_key, modulo)
  const s_inverse = shared_secret.modInverse(modulo)
  const message = sealed_data.multiply(s_inverse).mod(modulo)

  return message.toString()
}
