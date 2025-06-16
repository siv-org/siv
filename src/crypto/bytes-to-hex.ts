export const bytesToHex = (bytes: ArrayBuffer | Uint8Array) =>
  [...new Uint8Array(bytes)].reduce((memo, b) => memo + b.toString(16).padStart(2, '0'), '')

export const hexToBytes = (hex: string) =>
  new Uint8Array(hex.length / 2).map((_, i) => Number.parseInt(hex.slice(2 * i, 2 * i + 2), 16))
