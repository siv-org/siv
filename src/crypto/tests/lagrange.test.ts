import { expect, test } from 'bun:test'

import { lagrange_interpolation, moduloLambda } from '../lagrange'

// Example from https://babyphd.net/2016/03/introduction-to-threshold-signature-scheme/
// 2.2. Shamir’s Secret Sharing Scheme and Lagrange Coefficient

// Shamir’s threshold (3,4) over Z_7:
const modulo = BigInt(7)

// Distribution: Dealer has secret s=4
const secret = 4

// and picks a1 = 2, a2 = 5. Hence, polynomial P(x) = 4 + 2x + 5x ^ 2(mod 7).

type Point = [bigint, bigint]

// Dealer sends s1=4 to P1, s2=0 to P2, s3=6 to P1, s4=1 to P4.
const points: Point[] = (
  [
    [1, 4],
    [2, 0],
    [3, 6],
    [4, 1],
  ] as [number, number][]
).map((point) => point.map(BigInt) as Point)

// Reconstruction: When P1, P3 and P4 come together,
// we have s = 4
const points_used: Point[] = [points[0], points[2], points[3]]

test('can calculate individual modLambda products', () => {
  // 2nd lambda product (as given in example:)
  // = 1/(1-3) * 4/(4-3) % 7
  // = 2^(-1) * 4    % 7
  // = 4 * 4         % 7
  // = 16            % 7
  // = 2

  // But example is wrong on 2nd line...
  // should be (-2)^(-1), not positive 2^(-1).
  // = 1/(1-3)   * 4/(4-3) % 7
  // = (-2)^(-1) * 4 % 7
  // =    5^(-1) * 4 % 7
  // =        3  * 4 % 7
  // =            12 % 7
  // = 5
  expect(moduloLambda(1, points_used, modulo).toString()).toBe('5')
  // (moduloLambda is 0-indexed, so index=1 is the 2nd term)

  // 3rd lambda product (as given in example):
  // = 1/(1-4) * 3/(3-4) % 7
  // =  4^(-1) *  3^(-1) % 7
  // =      2  *      5  % 7
  // =               10  % 7
  // = 3

  // But example is again wrong on 2nd line...
  // 2nd term denominator is -1, ~= 6
  // = 1/(1-4)   * 3/(3-4)    % 7
  // = (-3)^(-1) * 3/(-1)     % 7
  // =   4 ^(-1) * 3/6        % 7
  // =        2  * 3*(6^(-1)) % 7
  // =        2  * 3*     6   % 7
  // =                   36   % 7
  // = 1
  expect(moduloLambda(2, points_used, modulo).toString()).toBe('1')
})

test('can find constant using lagrange interpolation', () => {
  expect(lagrange_interpolation(points_used, modulo).toString()).toBe(String(secret))
})
