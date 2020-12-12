import pick_random_integer from './pick-random-integer'
import { Big, Public_Key, big } from './types'

export function generate_key_pair(modulo: Big): { decryption_key: Big; public_key: Public_Key } {
  // Ensure modulo is prime
  if (!modulo.isProbablePrime(100)) {
    throw new Error(`Looks like input is not prime: ${modulo.toString()}`)
  }

  // Hard-code generator to 4 based on our Safe Primes
  // 2 is generator of q, so 4 is a generator of p (2q + 1)
  const generator = big(4)

  const decryption_key = pick_random_integer(modulo)

  const recipient = generator.modPow(decryption_key, modulo)

  return { decryption_key, public_key: { generator, modulo, recipient } }
}
