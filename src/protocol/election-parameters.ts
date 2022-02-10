import { RP, random_bigint } from 'src/crypto/curve'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'

export const decryption_key = random_bigint()
export const public_key = RP.BASE.multiply(decryption_key).toHex()

export const candidates = ['Angela Alioto', 'London Breed', 'Mark Leno', 'Jane Kim']

export const voters = ['Barton, Adam', 'Green, Elissa', 'Hauck, Erik', 'Schuster, Brad', 'Swift, Savannah'].map(
  (name) => ({ auth: generateAuthToken(), name }),
)
