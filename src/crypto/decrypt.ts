import { RP } from './curve'
import { Cipher } from './shuffle'

export default function decrypt(secret_key: bigint, cipher: Cipher): RP {
  const { encrypted, lock } = cipher

  const shared_secret = lock.multiply(secret_key)
  const message = encrypted.subtract(shared_secret)

  return message
}
