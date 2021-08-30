import { big } from './types'

const Alphabet = "0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ.,-():'!".split('')

const AlphabetToIndex: { [index: string]: number } = Alphabet.reduce(
  (memo, letter, index) => ({
    ...memo,
    [letter]: index,
  }),
  {},
)

export function encode(text: string) {
  const upper = text.toUpperCase()
  const indices = upper.split('').map((char) => {
    const index = AlphabetToIndex[char]
    if (index === undefined) {
      throw new RangeError(`${char} isn't defined in our encoding Alphabet`)
    }

    return index
  })
  const binary = indices.map((i) => i.toString(2))
  const padded = binary.map((i) => i.padStart(6, '0'))
  const encoded = big(padded.join(''), 2).toString()
  return encoded
}

export function decode(encoded: string) {
  if (!/^\d+$/.test(encoded)) {
    throw new TypeError(`Only decodes integers >= 0, not ${encoded}`)
  }

  const binaryString = big(encoded).toString(2)
  const { length } = binaryString
  const targetLength = Math.ceil(length / 6) * 6
  const padded = binaryString.padStart(targetLength, '0')
  const chunks = padded.match(/.{1,6}/g) as RegExpMatchArray
  const indices = chunks.map((c) => Number.parseInt(c, 2))
  const letters = indices.map((i) => Alphabet[i])
  const decoded = letters.join('')
  return decoded
}
