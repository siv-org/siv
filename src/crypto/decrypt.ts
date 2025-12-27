import { RP } from './curve'
import { Cipher, Public_Key } from './shuffle'

export function decrypt(secret_key: bigint, cipher: Cipher): RP {
  const { encrypted, lock } = cipher

  const shared_secret = lock.multiply(secret_key)
  const message = encrypted.subtract(shared_secret)

  return message
}

/**
 * Decrypt a cipher using the randomizer and public key.
 * This allows decryption without the secret key, useful for malware checks.
 *
 * Encryption: encrypted = message + (public_key * randomizer)
 * Decryption: message = encrypted - (public_key * randomizer)
 */
export function decryptWithRandomizer(public_key: Public_Key, randomizer: bigint, cipher: Cipher): RP {
  const { encrypted } = cipher

  // Calculate shared_secret = public_key * randomizer (same as in encryption)
  const shared_secret = public_key.multiply(randomizer)

  // Decrypt: message = encrypted - shared_secret
  const message = encrypted.subtract(shared_secret)

  return message
}
