import { Public_Key, bigPubKey } from '../crypto/types'

export const public_key: Public_Key = bigPubKey({
  generator: '2',
  modulo: '715604493385936562106467', // 80 bit key
  recipient: '543126634579150611316620',
})

export const decryption_key = '66217825219932135602133'

export const candidates = ['Angela Alioto', 'London Breed', 'Mark Leno', 'Jane Kim']

export const voters = [
  'Barton, Adam (you)',
  'Green, Elissa',
  'Hauck, Erik',
  'Schuster, Brad',
  'Swift, Savannah',
].map((name) => ({ auth: generateAuthToken(), name }))

function generateAuthToken() {
  const random = Math.random()
  const integer = String(random).slice(2)
  const hex = Number(integer).toString(16)
  const auth_token = hex.slice(0, 10)
  return auth_token
}
