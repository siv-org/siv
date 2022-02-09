import { Crypto } from '@peculiar/webcrypto'
import { RP } from 'src/crypto/curve'
import { sha256 } from 'src/crypto/sha256'

const crypto = new Crypto()

/*
KEYGEN ENCRYPTION

At the beginning——
- [x] Each party picks a private key `k`.
- [x] Each party publishes an encryption address `kG`, or `K`.

When party A wants to send an encrypted message to party B——
- [x] A picks a random nonce `n`.
- [x] A calculates a shared secret w/ B as `nK` (= `nkG`).
- [x] A SHA-256 hashes `nK` to use the hash-output `O` as a symmetric key for AES.
- [x] A calculates the encrypted messages as `AES_encrypt(O, msg)` => `E`.
- [x] A publishes the tuple (nG, E), which only B will be able to decrypt.

B can then decrypt (nG, E) by——
- [ ] B uses their private key `k`, to recalculate the shared secret as `knG`.
- [ ] B SHA-256 hashes `knG` to get the AES key `O`.
- [ ] B runs `AES_decrypt(O, E)` => `msg`.
*/

const AesAlgorithm = {
  iv: new Uint8Array(1), // null IV ok bc key always unique
  name: 'AES-GCM',
}

const deriveKey = async (sharedSecret: string): Promise<CryptoKey> =>
  crypto.subtle.importKey('raw', await sha256(sharedSecret), 'AES-GCM', false, ['encrypt', 'decrypt'])

export async function keygenEncrypt(
  recipient_address: RP,
  nonce: bigint,
  message: string,
): Promise<{ cipherhex: string; unlock: string }> {
  const sharedSecret = recipient_address.multiply(nonce).toHex()
  const shared_key = await deriveKey(sharedSecret)

  const ciphertext = await crypto.subtle.encrypt(AesAlgorithm, shared_key, new TextEncoder().encode(message))

  const cipherhex = [...new Uint8Array(ciphertext)].reduce((memo, b) => memo + b.toString(16), '')

  const unlock = RP.BASE.multiply(nonce).toHex()

  return { cipherhex, unlock }
}

export async function keygenDecrypt(
  unlock: RP,
  privateKey: bigint,
  ciphertext: string,
): Promise<{ ciphertext: string; nonceCommit: RP }> {
  const sharedSecret = unlock.multiply(privateKey).toHex()
  const shared_key = await deriveKey(sharedSecret)

  const decrypted = await crypto.subtle.decrypt(AesAlgorithm, shared_key, deserialized)

  console.log('decrypted', decrypted)

  return decrypted
}
