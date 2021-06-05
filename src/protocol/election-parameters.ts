import { Public_Key, bigPubKey } from '../crypto/types'

export const public_key: Public_Key = bigPubKey({
  generator: '4',
  modulo: '281375633683922886658704963872438275379', // 128 bit key
  recipient: '162567696536869589189269434776144034905',
})

export const decryption_key = '3320822681241378212890421251641054227'

export const candidates = ['Angela Alioto', 'London Breed', 'Mark Leno', 'Jane Kim']

export const voters = [
  'Barton, Adam',
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
