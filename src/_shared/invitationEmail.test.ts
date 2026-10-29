import { expect, test } from 'bun:test'

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
