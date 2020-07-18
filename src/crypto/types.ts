import { BigInteger as Big } from 'jsbn'
import { mapValues } from 'lodash'

export { BigInteger as Big } from 'jsbn'

export type Cipher_Text = {
  sealed_data: Big
  sealing_factor: Big
}

export type Public_Key = {
  generator: Big
  modulo: Big
  sealing_target: Big
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
export function big(input: number | string | Big): Big {
  // Is input already a Big?
  if (input instanceof Big) {
    return input
  }

  if (typeof input === 'number' && Number.isInteger(input)) {
    return new Big(String(input))
  }

  // Is input a string of a number?
  if (typeof input === 'string' && (Number.isInteger(Number(input)) || Number(input) === Infinity)) {
    return new Big(input)
  }

  throw new TypeError(`${input} is not a number or string of an integer`)
}

/** Converts cipher with string or number values to BigIntegers */
export const bigCipher = (o: { [P in keyof Cipher_Text]: string | number }) => mapValues(o, big)

/** Converts public_key with string or number values to BigIntegers */
export const bigPubKey = (o: { [P in keyof Public_Key]: string | number }) => mapValues(o, big)

export const stringify = (object: Cipher_Text | Public_Key) => objToString(mapValues(object, (v: Big) => v.toString()))

const objToString = (obj: Record<string, string>) =>
  `{ ${Object.keys(obj)
    .map((key) => `${key}: ${obj[key]}`)
    .join(', ')} }`
