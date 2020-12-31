import { range } from 'lodash-es'

import { moduloLambda } from '../crypto/lagrange'
import { combine_partials } from '../crypto/threshold-keygen'
import { big } from '../crypto/types'
import { StateAndDispatch, getParameters } from './keygen-state'

export const CombinePartials = ({ state }: StateAndDispatch) => {
  const { trustees = [], parameters, threshold_public_key } = state

  const partials = trustees.map((t) => t.partial_decryption).filter((p) => p)

  if (!parameters || partials.length < parameters.t || !threshold_public_key) {
    return <></>
  }

  const big_p = big(parameters.p)

  const indices = range(1, partials.length + 1)
  const indices_as_bigs = indices.map((index) => [big(index)])
  const lambdas = indices_as_bigs.map((_, index) => moduloLambda(index, indices_as_bigs, big(parameters.q)))
  const combined = combine_partials(
    partials.map((p) => big(p as string)),
    getParameters(state),
  ).toString()
  const combined_inverse = big(combined).modInverse(big_p).toString()

  // Repeating encryption code from 11...
  const plaintext = '2020'
  const randomizer = '108'
  const encrypted = big(threshold_public_key).modPow(big(randomizer), big_p).multiply(big(plaintext)).mod(big_p)

  const decrypted = big(combined_inverse).multiply(encrypted).mod(big_p)

  return (
    <>
      <h3>XII. Combine Partials:</h3>
      <p>
        The partials can be combined using{' '}
        <a href="https://en.wikipedia.org/wiki/Lagrange_polynomial" rel="noreferrer" target="_blank">
          Langrangian Interpolation
        </a>
        .
      </p>
      <p>
        <code>
          d = d[1]^λ[1] ... d[t]^λ[t]
          <br />
          &nbsp; = c[1]^(s[1]λ[1]) ... c[1]^(s[t]λ[t])
          <br />
          &nbsp; = c[1]^a
        </code>
      </p>
      <p>For our function, mod q = {parameters.q}, these Langrangians work out to:</p>
      <ol>
        {lambdas.map((l, index) => (
          <li key={index}>{l.toString()}</li>
        ))}
      </ol>
      <p>
        So, <i>combined</i> = {partials.map((p, index) => `(${p} ^ ${lambdas[index]})`).join(' * ')} % {parameters.p} ≡{' '}
        {combined || '...'}
      </p>
      <p>Then, we can take this combined value and finish the standard ElGamal decryption.</p>
      <p>
        decrypted_message = combined
        <sup>-1</sup> * encrypted % p
      </p>
      <p>
        combined
        <sup>-1</sup> % p ≡ {combined_inverse}
      </p>
      <p>
        Thus, decrypted_message = {combined_inverse} * {encrypted.toString()} % {parameters.p} ≡ {decrypted.toString()}
      </p>
      <p>Which {decrypted.toString() === plaintext ? '✅ matches' : '❌ does not match'} plaintext.</p>
      {/* <br />
      <h3>All done. 🎉</h3> */}
    </>
  )
}
