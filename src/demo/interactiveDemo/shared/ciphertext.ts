export function fakeCipher(seed: string) {
  const { encrypted, lock } = fakeCipherParts(seed)
  return `{ encrypted: ${encrypted}, lock: ${lock} }`
}

export function fakeCipherParts(seed: string) {
  // ponytail: decorative ciphertext sized like Ristretto hex (~64 chars); real encrypt lives in /protocol + vote UI
  const bytes = (salt: number) => {
    let hex = ''
    for (let i = 0; hex.length < 64; i++)
      hex += ((seed.charCodeAt(i % seed.length) * (17 + i) * salt) & 0xff).toString(16).padStart(2, '0')
    return hex.slice(0, 64)
  }
  return { encrypted: bytes(7919), lock: bytes(4999) }
}
