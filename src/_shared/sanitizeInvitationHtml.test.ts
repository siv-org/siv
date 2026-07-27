import { expect, test } from 'bun:test'

import { sanitizeInvitationHtml } from './sanitizeInvitationHtml'

test('keeps safe invitation markup and strips scripts', () => {
  expect(sanitizeInvitationHtml('<p>Hello <strong>world</strong></p><script>alert(1)</script>')).toBe(
    '<p>Hello <strong>world</strong></p>alert(1)',
  )
  expect(sanitizeInvitationHtml('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>')
  expect(sanitizeInvitationHtml('<a href="https://siv.org">SIV</a>')).toBe('<a href="https://siv.org">SIV</a>')
  expect(sanitizeInvitationHtml('<p onclick="evil()">hi</p>')).toBe('<p>hi</p>')
  expect(sanitizeInvitationHtml('<ul><li>one</li></ul>')).toBe('<ul><li>one</li></ul>')
})
