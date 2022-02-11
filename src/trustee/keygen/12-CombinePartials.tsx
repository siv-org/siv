import { CURVE, RP, pointToString, stringToPoint } from 'src/crypto/curve'
import { range } from 'src/utils'

import { moduloLambda } from '../../crypto/lagrange'
import { combine_partials } from '../../crypto/threshold-keygen'
import { StateAndDispatch } from '../trustee-state'
import { plaintext, randomizer } from './11-PartialDecryptionTest'

export const CombinePartials = ({ state }: StateAndDispatch) => {
  const { trustees = [], t, threshold_public_key } = state

  const partials = trustees.map((t) => t.partial_decryption).filter((p) => p)

  if (!t || partials.length < t || !threshold_public_key) return <></>

  const indices = range(1, partials.length + 1)
  const indices_as_bigs = indices.map((index) => [BigInt(index)])
  const lambdas = indices_as_bigs.map((_, index) => moduloLambda(index, indices_as_bigs, CURVE.l))
  const combined = combine_partials(partials.map((p) => RP.fromHex(p as string)))

  // Repeating encryption code from 11...
  // const encrypted = big(threshold_public_key).modPow(big(randomizer), big_p).multiply(big(plaintext)).mod(big_p)
  const encrypted = RP.fromHex(threshold_public_key).multiplyUnsafe(randomizer).add(stringToPoint(plaintext))

  const decrypted = encrypted.subtract(combined)

  return (
    <>
      <h3>XII. Combine Partials:</h3>
      <p>
        The partials can be combined using{' '}
        <a href="https://en.wikipedia.org/wiki/Lagrange_polynomial" rel="noreferrer" target="_blank">
          Lagrangian Interpolation
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
      <p>For our function, mod l = {`${CURVE.l}`}, these Lagrangians work out to:</p>
      <ol>
        {lambdas.map((l, index) => (
          <li key={index}>{`${l}`}</li>
        ))}
      </ol>
      <p>
        So, <i>Combined</i> = {partials.map((p, index) => `(${p} * ${lambdas[index]})`).join(' + ')} ≡{' '}
        {`${combined}` || '...'}
      </p>
      <p>Then, we can take this combined value and finish Elliptic Curve ElGamal decryption.</p>
      <p>decrypted_point = encrypted - combined</p>
      <p>
        {`${encrypted}`} - {`${combined}`} ≡ {`${decrypted}`}
      </p>
      <p>Which decodes back into the message: `{pointToString(decrypted)}`</p>
      <p>Which {pointToString(decrypted) === plaintext ? '✅ matches' : '❌ does not match'} plaintext.</p>
    </>
  )
}
