/**
 * Base64URL encoding/decoding utilities
 * Base64URL is URL-safe: uses '-' instead of '+', '_' instead of '/', and removes padding '='
 */

const Big0 = BigInt(0)
const Big8 = BigInt(8)
const BigFF = BigInt(0xff)

/**
 * Convert a base64url string back to bigint
 */
export function base64URLToBigint(encoded: string): bigint {
  // Add padding back if needed
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4
  if (padding) {
    base64 += '='.repeat(4 - padding)
  }

  // Decode from base64 to bytes
  const bytes =
    typeof window !== 'undefined'
      ? new Uint8Array(
          atob(base64)
            .split('')
            .map((c) => c.charCodeAt(0)),
        )
      : new Uint8Array(Buffer.from(base64, 'base64'))

  // Convert bytes to bigint (big-endian)
  let result = Big0
  for (let i = 0; i < bytes.length; i++) {
    result = (result << Big8) | BigInt(bytes[i])
  }

  return result
}

/**
 * Convert a bigint to base64url string
 */
export function bigintToBase64URL(value: bigint): string {
  // Convert bigint to bytes (little-endian)
  const bytes: number[] = []
  let n = value
  while (n > Big0) {
    bytes.push(Number(n & BigFF))
    n = n >> Big8
  }

  // Reverse to get big-endian (most significant byte first)
  bytes.reverse()

  // Convert bytes to base64url
  const bytesArray = new Uint8Array(bytes)
  const base64 =
    typeof window !== 'undefined'
      ? btoa(String.fromCharCode(...bytesArray))
      : Buffer.from(bytesArray).toString('base64')

  // Convert to base64url format
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
