import { describe, expect, test } from 'bun:test'

import { isPackedByCursor } from './is-packed-by-cursor'

const ts = (ms: number) => ({ toMillis: () => ms })

describe('isPackedByCursor', () => {
  test('nothing packed yet → not packed', () => {
    expect(isPackedByCursor(ts(100), 'a', null, null)).toBe(false)
    expect(isPackedByCursor(ts(100), 'a', ts(100), null)).toBe(false)
  })

  test('before / after / equal cursor', () => {
    const cursorAt = ts(100)
    const cursorId = 'm'

    expect(isPackedByCursor(ts(50), 'z', cursorAt, cursorId)).toBe(true)
    expect(isPackedByCursor(ts(150), 'a', cursorAt, cursorId)).toBe(false)
    expect(isPackedByCursor(ts(100), 'a', cursorAt, cursorId)).toBe(true)
    expect(isPackedByCursor(ts(100), 'm', cursorAt, cursorId)).toBe(true)
    expect(isPackedByCursor(ts(100), 'z', cursorAt, cursorId)).toBe(false)
  })
})
