import pick_random_integer from './pick-random-integer'
import { big } from './types'

/**
 * This generates a Safe Prime `p` with a generator 4, and its accompanying Sophie-Germain prime `q`
 *
 * p = 2q + 1
 *
 * https://en.wikipedia.org/wiki/Safe_and_Sophie_Germain_primes
 */
export function generate_safe_prime(bit_size: number, timeout_seconds = 10) {
  const stop_time = Date.now() + timeout_seconds * 1000

  // Keep trying until timeout
  // `continue` keyword restarts the loop back at the top
  /* eslint-disable no-continue */
  while (Date.now() < stop_time) {
    // Try a random integer q less than 2^bit_size
    const q = pick_random_integer(big(2).pow(bit_size))

    // Is q big enough?
    if (q.bitLength() + 1 !== bit_size) continue

    // Is q prime?
    if (!q.isProbablePrime(100)) continue

    // Calculate p = 2q + 1
    const p = q.multiply(big(2)).add(big(1))

    // Is p prime?
    if (!p.isProbablePrime(100)) continue
    const two = big(2)

    // Is 2 a generator of the cyclic group Z_p ?
    // Ensure 2^[p-1's factors] % p aren't congruent to 1
    // For this case, we know p-1's factors are 2 & q
    // https://crypto.stackexchange.com/questions/68317/how-to-verify-if-g-is-a-generator-for-p/68328#68328
    if (two.modPow(two, p).equals(big(1))) continue
    if (two.modPow(q, p).equals(big(1))) continue

    // Found an acceptable safe / sophie-germain prime pair, return the parameters
    return { g: big(4), p, q }
  }

  throw new Error(`Couldn't generate_safe_primes within ${timeout_seconds}s timeout`)
}
