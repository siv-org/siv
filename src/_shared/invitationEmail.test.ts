import { expect, test } from 'bun:test'
import { createHash } from 'node:crypto'

import { buildEmailHtml, buildInvitationBody, buildSubject } from './invitationEmail'

test('invitation renderer keeps the real email wrapper, custom copy and personal link', async () => {
  const link = 'https://siv.org/demo?vote&auth=abcdef1234'
  const text = await buildInvitationBody({
    custom_text: '**Welcome** <script>alert(1)</script>',
    link,
    subject_line: `[TEST 12:34] ${buildSubject('A & B')}`,
  })
  const html = buildEmailHtml({ custom_email_headerbar: 'Election office', preheader: 'Vote now', text })
  expect(html).toContain('Election office')
  expect(html).toContain('Vote now')
  expect(html).toContain('Vote Invitation: A & B')
  expect(html).toContain('<strong>Welcome</strong>')
  expect(html).toContain('href="https://siv.org/demo?vote&auth=abcdef1234"')
  expect(html).not.toContain('[TEST')
  expect(html).not.toContain('<script>')
})

// Hashes captured from the original API renderers before extraction.
test('production HTML stays byte-for-byte identical to the original API templates', async () => {
  const cases = [
    [
      {
        link: 'https://siv.org/election/123/vote?auth=abcdef1234',
        subject_line: 'Vote Invitation: Mayor',
      },
      'ece1ad1b397e9a0ad0dd279947a7da9def6f5c7bb4303e7d8f9f3835826fe8c3',
    ],
    [
      {
        custom_email_headerbar: 'Election office',
        custom_text: '**Welcome** <script>alert(1)</script>',
        link: 'https://siv.org/demo?vote&auth=abcdef1234',
        preheader: 'Vote now',
        subject_line: '[TEST 12:34] Vote Invitation: A & B',
      },
      '2fcd4fc2e894cae023e10d75ddb0b81c5d5050a8d54d93d07f95bf3d6bba33b7',
    ],
    [
      {
        custom_text: '   ',
        link: 'https://siv.org/election/123/vote?auth=abcdef1234',
        preheader: 'Invitation preview',
        subject_line: 'Vote Invitation',
      },
      'be9c84b2f8365f500ae1c2165eb0bc967a0196657aec7bf6f9f7962702104ccd',
    ],
  ] as const
  for (const [input, expected] of cases) {
    const html = buildEmailHtml({ ...input, text: await buildInvitationBody(input) })
    expect(createHash('sha256').update(html).digest('hex')).toBe(expected)
  }
})
