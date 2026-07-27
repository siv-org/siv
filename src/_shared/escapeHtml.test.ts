import { expect, test } from 'bun:test'

import { escapeHtml } from './escapeHtml'

test('escapes text before inserting it into HTML', () => {
  expect(escapeHtml(`<script>"Tom & Jerry's"</script>`)).toBe(
    '&lt;script&gt;&quot;Tom &amp; Jerry&#39;s&quot;&lt;/script&gt;',
  )
})
