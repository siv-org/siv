import { Public_Key, bigPubKey } from '../crypto/types'

export const public_key: Public_Key = bigPubKey({
  generator: '2',
  modulo: '1083210858721378763', // 60 bit key
  sealing_target: '119677511493916793',
})

export const decryption_key = '170121057240471299'

export const candidates = ['Angela Alioto', 'London Breed', 'Mark Leno', 'Jane Kim']

export const voters = [
  'Barton, Adam (you)',
  'Green, Erik',
  'Hauck, Brad',
  'Schuster, Elissa',
  'Swift, Savannah',
].map((name) => ({ name, token: generateToken() }))

function generateToken() {
  const random = Math.random()
  const integer = String(random).slice(2)
  const hex = Number(integer).toString(16)
  const token = hex.slice(0, 10)
  return token
}
