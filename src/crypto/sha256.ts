import { Crypto } from '@peculiar/webcrypto'

const crypto = new Crypto()

/** Example from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Basic_example */
export async function sha256(message: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return hash
}
