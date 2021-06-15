import { BigInteger as Big } from 'jsbn'
import { mapValues, reduce } from 'lodash-es'

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
export function big(input: number | Big | string | number[], radix = 10): Big {
  // Is input already a Big?
  if (input instanceof Big) {
    return input
  }

  if (typeof input === 'number' && Number.isInteger(input)) {
    return new Big(String(input))
  }

  // Can also pass in an array of bytes
  if (Array.isArray(input)) {
    return new Big(input)
  }

  // Is input a string of a number?
  if (typeof input === 'string') {
    return new Big(input, radix)
  }

  throw new TypeError(`${input} is not a number or string of an integer`)
}

/** Converts cipher with string or number values to BigIntegers */
export const bigCipher = (obj: { [P in keyof Cipher_Text]: string | number }) =>
  reduce(obj, (memo, value, key) => ({ ...memo, [key]: big(value) }), {}) as Cipher_Text

/** Converts public_key with string or number values to BigIntegers */
export const bigPubKey = (obj: { [P in keyof Public_Key]: string | number }) =>
  reduce(obj, (memo, value, key) => ({ ...memo, [key]: big(value) }), {}) as Public_Key

/** Converts an object of bigs to strings */
export const toStrings = (object: Cipher_Text | Public_Key) =>
  JSON.stringify(mapValues(object, (v: Big) => v.toString()))

/** Recursively converts deep objects of Bigs to strings */
export function bigs_to_strs(o: unknown | unknown[] | Record<string, unknown>): unknown {
  if (typeof o === 'object') {
    if (o === null) {
      throw new TypeError('No support for `null`')
    }
    if (Array.isArray(o)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return o.map((v) => {
        if (v instanceof Big) return v.toString()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return bigs_to_strs(v)
      })
    }

    const returnValue: Record<string, unknown> = {}
    Object.entries(o).forEach(([k, v]) => {
      if (v instanceof Big) returnValue[k] = v.toString()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      else returnValue[k] = bigs_to_strs(v)
    })
    return returnValue
  }
  return o
}

export function to_bigs(o: unknown | unknown[] | Record<string, unknown>): unknown {
  if (typeof o === 'object') {
    if (o === null) {
      throw new TypeError('No support for `null`')
    }
    if (Array.isArray(o)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return o.map((v) => {
        if (typeof v === 'string' || typeof v === 'number') return big(v)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return to_bigs(v)
      })
    }

    const returnValue: Record<string, unknown> = {}
    Object.entries(o).forEach(([k, v]) => {
      if (typeof v === 'string' || typeof v === 'number') returnValue[k] = big(v)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      else returnValue[k] = to_bigs(v)
    })
    return returnValue
  }
  return o
}
