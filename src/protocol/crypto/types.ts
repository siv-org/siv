import { BigInteger as Big } from 'jsbn'
import { reduce } from 'lodash-es'

export { BigInteger as Big } from 'jsbn'

export type Cipher_Text = {
  encrypted: Big
  unlock: Big
}

export type Public_Key = {
  generator: Big
  modulo: Big
  recipient: Big
}

// Add Big helper methods greaterThan/lessThan
declare module 'jsbn' {
  interface BigInteger {
    greaterThan(x: Big): boolean
    lessThan(x: Big): boolean
  }
}

/* eslint-disable-next-line func-names */
Big.prototype.greaterThan = function (x: Big) {
  return (this as Big).compareTo(x) > 0
}

/* eslint-disable-next-line func-names */
Big.prototype.lessThan = function (x: Big) {
  return (this as Big).compareTo(x) < 0
}

/** Smartly converts numbers or strings of numbers into Big */
export function big(input: number | Big | string, radix = 10): Big {
  // Is input already a Big?
  if (input instanceof Big) {
    return input
  }

  if (typeof input === 'number' && Number.isInteger(input)) {
    return new Big(String(input))
  }

  // Is input a string of a number?
  if (typeof input === 'string' && (Number.isInteger(Number(input)) || Number(input) === Infinity)) {
    return new Big(input, radix)
  }

  throw new TypeError(`${input} is not a number or string of an integer`)
}

/** Converts public_key with string or number values to BigIntegers */
export const bigPubKey = (obj: { [P in keyof Public_Key]: string | number }) =>
  reduce(obj, (memo, value, key) => ({ ...memo, [key]: big(value) }), {}) as Public_Key
