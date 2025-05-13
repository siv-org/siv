import { invert, mod } from './curve'

/** = product[j !== i]{ j / (j - i) (mod p) } */
export const moduloLambda = (index: number, points: bigint[][], modulo: bigint, debug?: boolean): bigint => {
  const i = points[index][0]

  const log = debug ? console.log : () => void 0

  return points.reduce((memo, point, currentIndex) => {
    // Skip index
    if (index === currentIndex) {
      return memo
    }
    const j = point[0]
    log({ j })

    const numerator = mod(-j, modulo)
    const denominator = mod(i - j, modulo)
    log({ denominator: denominator.toString() })

    const term = numerator * invert(denominator, modulo)
    log({ term })

    return mod(memo * term, modulo)
  }, BigInt(1))
}

/** sum[i=1, t]{ s_i * lambda_i} (mod p) */
export const lagrange_interpolation = (points: [bigint, bigint][], modulo: bigint): bigint =>
  points.reduce((memo, point, index) => {
    const lambda = moduloLambda(index, points, modulo)
    const s = point[1]
    const addend = mod(s * lambda, modulo)
    return mod(memo + addend, modulo)
  }, BigInt(0))
