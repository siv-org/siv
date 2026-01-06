import { Crypto } from '@peculiar/webcrypto'

const crypto = new Crypto()

const AesAlgorithm = {
  counter: new Uint8Array(16), // null ok bc key always unique
  length: 64,
  name: 'AES-CTR',
}

/** Decrypt a base64url-encoded ciphertext using AES-CTR with the given key.
   Returns the decrypted string */
export async function decryptSymmetric(key: CryptoKey, ciphertext: string): Promise<string> {
  // Convert base64url to base64
  let base64 = ciphertext.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4
  if (padding) {
    base64 += '='.repeat(4 - padding)
  }

  // Decode base64 to bytes
  const cipherBytes =
    typeof window !== 'undefined'
      ? new Uint8Array(
          atob(base64)
            .split('')
            .map((c) => c.charCodeAt(0)),
        )
      : new Uint8Array(Buffer.from(base64, 'base64'))

  const decrypted = await crypto.subtle.decrypt(AesAlgorithm, key, cipherBytes)
  return new TextDecoder().decode(decrypted)
}

/** Encrypt a string using AES-CTR with the given key.
    Returns base64url-encoded ciphertext */
export async function encryptSymmetric(key: CryptoKey, data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data)
  const ciphertext = await crypto.subtle.encrypt(AesAlgorithm, key, encoded)

  const bytes = new Uint8Array(ciphertext)
  const base64 =
    typeof window !== 'undefined' ? btoa(String.fromCharCode(...bytes)) : Buffer.from(bytes).toString('base64')

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/** Export a CryptoKey to base64url string for storage in URL hash */
export async function exportKeyToBase64URL(key: CryptoKey): Promise<string> {
  const keyData = await crypto.subtle.exportKey('raw', key)
  const bytes = new Uint8Array(keyData)
  const base64 =
    typeof window !== 'undefined' ? btoa(String.fromCharCode(...bytes)) : Buffer.from(bytes).toString('base64')
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/** Generate a 128-bit symmetric encryption key */
export async function generateSymmetricKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ length: 128, name: 'AES-CTR' }, true, ['encrypt', 'decrypt'])
}

/** Import a base64url string back to a CryptoKey */
export async function importKeyFromBase64URL(base64url: string): Promise<CryptoKey> {
  // Convert base64url to base64
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4
  if (padding) base64 += '='.repeat(4 - padding)

  // Decode base64 to bytes
  const bytes =
    typeof window !== 'undefined'
      ? new Uint8Array(
          atob(base64)
            .split('')
            .map((c) => c.charCodeAt(0)),
        )
      : new Uint8Array(Buffer.from(base64, 'base64'))

  return crypto.subtle.importKey('raw', bytes, { length: 128, name: 'AES-CTR' }, false, ['encrypt', 'decrypt'])
}
