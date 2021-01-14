import { Big, big } from './types'

/** = product[j !== i]{ j / (j - i) (mod p) } */
export const moduloLambda = (index: number, points: Big[][], modulo: Big, debug?: boolean): Big => {
  const i = points[index][0]

  // eslint-disable-next-line no-console
  const log = debug ? console.log : () => void 0

  return points.reduce((memo, point, currentIndex) => {
    // Skip index
    if (index === currentIndex) {
      return memo
    }
    const j = point[0]
    log({ j: j.toString() })

    const numerator = big(0).subtract(j).mod(modulo)
    const denominator = i.subtract(j).mod(modulo)
    log({ denominator: denominator.toString() })

    const term = numerator.multiply(denominator.modInverse(modulo))
    log({ term: term.toString() })

    return memo.multiply(term).mod(modulo)
  }, big(1))
}

/** sum[i=1, t]{ s_i * lambda_i} (mod p) */
export const lagrange_interpolation = (points: [Big, Big][], modulo: Big): Big =>
  points.reduce((memo, point, index) => {
    const lambda = moduloLambda(index, points, modulo)
    const s = point[1]
    const addend = s.multiply(lambda).mod(modulo)
    return memo.add(addend).mod(modulo)
  }, big(0))
