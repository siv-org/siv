import pick_random_integer from './pick-random-integer'
import { Big, Public_Key, big } from './types'

function generate_key_pair(modulo: Big): [Big, Public_Key] {
  // Ensure modulo is prime
  if (!modulo.isProbablePrime(100)) {
    throw new Error(`Looks like input is not prime: ${modulo.toString()}`)
  }

  // Hard-code generator to 2
  // (based on 'Safe Primes' we're expecting from OpenSSL)
  const generator = big(2)

  const secret = pick_random_integer(modulo)

  const recipient = generator.modPow(secret, modulo)

  return [secret, { generator, modulo, recipient }]
}

export default generate_key_pair
