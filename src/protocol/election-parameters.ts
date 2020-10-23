import { Public_Key, bigPubKey } from '../crypto/types'

export const public_key: Public_Key = bigPubKey({
  generator: '2',
  modulo: '324055971942726208597707896976389887403', // 128 bit key
  recipient: '310239354488225371009501519625634456790',
})

export const decryption_key = '212242581924932109609312943307120196201'

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
