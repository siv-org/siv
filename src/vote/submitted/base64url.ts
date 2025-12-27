/**
 * Base64URL encoding/decoding utilities
 * Base64URL is URL-safe: uses '-' instead of '+', '_' instead of '/', and removes padding '='
 */

export function encodeBase64URL(data: string): string {
  // Convert string to base64
  const base64 = typeof window !== 'undefined' ? btoa(data) : Buffer.from(data, 'utf-8').toString('base64')

  // Convert to base64url format
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function decodeBase64URL(encoded: string): string {
  // Add padding back if needed
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4
  if (padding) {
    base64 += '='.repeat(4 - padding)
  }

  // Decode from base64
  return typeof window !== 'undefined' ? atob(base64) : Buffer.from(base64, 'base64').toString('utf-8')
}

