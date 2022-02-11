import { Crypto } from '@peculiar/webcrypto'

import { bytesToHex, hexToBytes } from './bytes-to-hex'
import { RP } from './curve'
import { sha256 } from './sha256'

const crypto = new Crypto()

/*
KEYGEN ENCRYPTION

This encrypts a message using a DH key exchange, to calculate a shared AES key.

It doesn't allow for re-encryption / cryptographic shuffles like ElGamal, but it's better for longer messages.

Initially ——
- Each party that wants to receive messages picks a private key `k`.
- They publish their public encryption address `kG` (= `K`).

When party A wants to send an encrypted message to party B ——
- A picks a random nonce `n`.
- A calculates a shared secret w/ B as `nK` (= `nkG`).
- A SHA-256 hashes `nK` to use the hash-output `O` as a symmetric key for AES.
- A calculates the encrypted messages as `AES_encrypt(O, msg)` => `E`.
- A publishes the tuple (nG, E), which only B will be able to decrypt.

B can then decrypt (nG, E) by——
- B uses their private key `k`, to recalculate the shared secret as `knG`.
- B SHA-256 hashes `knG` to get the AES key `O`.
- B runs `AES_decrypt(O, E)` => `msg`.
*/

const AesAlgorithm = {
  counter: new Uint8Array(16), // null ok bc key always unique
  length: 64,
  name: 'AES-CTR',
}

const deriveKey = async (sharedSecret: string): Promise<CryptoKey> =>
  crypto.subtle.importKey('raw', await sha256(sharedSecret), 'AES-CTR', false, ['encrypt', 'decrypt'])

export async function keygenEncrypt(
  recipient_address: RP,
  nonce: bigint,
  message: string,
): Promise<{ Unlock: string; cipherhex: string }> {
  const sharedSecret = recipient_address.multiply(nonce).toHex()
  const shared_key = await deriveKey(sharedSecret)

  const encoded = new TextEncoder().encode(message)
  const ciphertext = await crypto.subtle.encrypt(AesAlgorithm, shared_key, encoded)

  const cipherhex = bytesToHex(ciphertext)

  const Unlock = RP.BASE.multiply(nonce).toHex()

  // console.log('🟣 encrypt message', message)
  // console.log('🟣 encrypt nonce', nonce)
  // console.log('🟣 encrypt sharedSecret', sharedSecret)
  // console.log('🟣 encrypt encoded', encoded)
  // console.log('🟣 encrypt ciphertext', [...new Uint8Array(ciphertext)])
  // console.log('🟣 encrypt cipherhex', cipherhex)
  // console.log('🟣 encrypt Unlock', Unlock)

  return { Unlock, cipherhex }
}

export async function keygenDecrypt(privateKey: bigint, ciphertext: string): Promise<string> {
  const { Unlock, cipherhex } = JSON.parse(ciphertext) as { Unlock: string; cipherhex: string }

  const sharedSecret = RP.fromHex(Unlock).multiply(privateKey).toHex()
  const shared_key = await deriveKey(sharedSecret)

  const cipher_bytes = hexToBytes(cipherhex)

  const decrypted = await crypto.subtle.decrypt(AesAlgorithm, shared_key, cipher_bytes)
  const decoded = new TextDecoder().decode(decrypted)

  // console.log('🔵 decrypt privateKey', privateKey)
  // console.log('🔵 decrypt Unlock', Unlock)
  // console.log('🔵 decrypt cipherhex', cipherhex)
  // console.log('🔵 decrypt sharedSecret', sharedSecret)
  // console.log('🔵 decrypt cipher_bytes', cipher_bytes)
  // console.log('🔵 decrypt decrypted', decrypted)
  // console.log('🔵 decrypt decoded', decoded)

  return decoded
}
