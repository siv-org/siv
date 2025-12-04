import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'
import { NextApiRequest, NextApiResponse } from 'next'

import { sendEmail } from './_services'

const { ACCEPTS_LOCALHOST_EMAILS = 'none set' } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => res.status(401).send('Deprecated')

export const buildSubject = (election_title?: string) => `Vote Invitation${election_title ? `: ${election_title}` : ''}`

export const send_invitation_email = async ({
  custom_email_headerbar,
  custom_text,
  from,
  link,
  subject_line,
  tag,
  voter,
}: {
  custom_email_headerbar?: string
  custom_text?: string
  from?: string
  link: string
  subject_line: string
  tag: string
  voter: string
}) => {
  // Don't accidentally send localhost emails
  if (link.includes('localhost')) {
    // Unless the recipient is a whitelisted admin address
    const toAdmin = voter.endsWith(ACCEPTS_LOCALHOST_EMAILS)
    if (!toAdmin)
      throw `Blocking sending 'localhost' email link to ${voter}. Override with env.ACCEPTS_LOCALHOST_EMAILS`
  }

  // Make sure auth_token is well formed
  if (!/auth=(\d|[a-f]){10}$/.test(link)) throw `Blocking sending malformed auth invite ${link} to ${voter}`

  // Use custom text if provided, otherwise use default
  const emailBody =
    `<h2 style="margin: 0;">${subject_line.replace(/^\[TEST \d\d:\d\d\] /, '')}</h2>` +
    (custom_text?.trim()
      ? `${DOMPurify.sanitize(
          (await marked(custom_text)).replaceAll(/\n/g, ''),
        )}<br /><br /><hr style="border: none; border-top: 2px solid #e0e0e0; width: 50%; margin: 15px auto;" /><br />`
      : '') +
    `<div style="font-weight: 500; font-size: 16px; margin-top: 15px; margin-bottom: 5px; letter-spacing: 0.4px;">Click here to securely cast your vote:</div><a href="${link}" style="font-weight: 600; color: #0066cc; text-decoration: underline; font-size: 16px; letter-spacing: 0.2px; word-break: break-all; line-height: 1.6;">${link}</a>

    <em style="font-size: 13px; opacity: 0.6; font-style: italic;">This link is unique for you. Don't share it with anyone.</em>`

  return sendEmail({
    custom_email_headerbar,
    from,
    preheader: `Click here to securely cast your vote: ${link}`,
    recipient: voter,
    subject: subject_line,
    tag,
    text: emailBody,
  })
}
