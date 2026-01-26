import { describe, expect, test } from 'bun:test'

import { parseAddVoters } from './parseAddVoters'

describe('parseAddVoters', () => {
  test('accepts one email per line', () => {
    expect(parseAddVoters('a@b.com\nc@d.com')).toEqual([{ email: 'a@b.com' }, { email: 'c@d.com' }])
  })

  test('accepts fast placeholder emails like 1@1', () => {
    expect(parseAddVoters('1@1\n2@1\n3@1')).toEqual([{ email: '1@1' }, { email: '2@1' }, { email: '3@1' }])
  })

  test('parses tab-separated two-column paste (email + display name)', () => {
    expect(parseAddVoters('alice@email.com\tAlice Example')).toEqual([{ display_name: 'Alice Example', email: 'alice@email.com' }])
  })

  test('parses tab-separated two-column paste (display name + email)', () => {
    expect(parseAddVoters('Alice Example\talice@email.com')).toEqual([{ display_name: 'Alice Example', email: 'alice@email.com' }])
  })

  test('tolerates a header row', () => {
    expect(parseAddVoters('email\tname\nalice@email.com\tAlice Example')).toEqual([
      { display_name: 'Alice Example', email: 'alice@email.com' },
    ])
  })

  test('parses email-client recipient forms', () => {
    expect(parseAddVoters('"John Doe" <john.doe@email.com>')).toEqual([
      { display_name: 'John Doe', email: 'john.doe@email.com' },
    ])
    expect(parseAddVoters('Jane Doe <jane.doe@email.com>')).toEqual([
      { display_name: 'Jane Doe', email: 'jane.doe@email.com' },
    ])
  })

  test('splits comma-separated recipients on a single line', () => {
    expect(parseAddVoters('"John Doe" <john.doe@email.com>, "Jane Doe" <jane.doe@email.com>')).toEqual([
      { display_name: 'John Doe', email: 'john.doe@email.com' },
      { display_name: 'Jane Doe', email: 'jane.doe@email.com' },
    ])
  })

  test('dedupes by normalized email', () => {
    expect(parseAddVoters('A@B.com\na@b.com')).toEqual([{ email: 'a@b.com' }])
  })
})

