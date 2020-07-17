const Alphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

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
  const padded = binary.map((i) => i.padStart(5, '0'))
  const encoded = Number.parseInt(padded.join(''), 2)
  return encoded
}

export function decode(encoded: number) {
  const binaryString = encoded.toString(2)
  const { length } = binaryString
  const targetLength = Math.ceil(length / 5) * 5
  const padded = binaryString.padStart(targetLength, '0')
  const chunks = padded.match(/.{1,5}/g) as RegExpMatchArray
  const indices = chunks.map((c) => Number.parseInt(c, 2))
  const letters = indices.map((i) => Alphabet[i])
  const decoded = letters.join('')
  return decoded
}
