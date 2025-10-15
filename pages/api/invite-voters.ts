import { marked } from 'marked'
import { NextApiRequest, NextApiResponse } from 'next'

import { sendEmail } from './_services'

const { ACCEPTS_LOCALHOST_EMAILS = 'none set' } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => res.status(401).send('Deprecated')

export const buildSubject = (election_title?: string) => `Vote Invitation${election_title ? `: ${election_title}` : ''}`

export const send_invitation_email = async ({
  custom_text,
  from,
  link,
  subject_line,
  tag,
  voter,
}: {
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

  // const emailBody = custom_text
  // ? `${marked(
  //     custom_text,
  //   )}<br/><br/><a href="${link}" style="font-weight: bold;">${link}</a><br/><br/><em style="font-size:13px; opacity: 0.6;">This link is unique for you. Don't share it with anyone.</em>`
  // :

  // Use custom text if provided, otherwise use default
  const emailBody =
    `<h2 style="margin: 0">${subject_line}</h2>` +
    (custom_text
      ? `${(await marked(custom_text)).replaceAll(
          /\n/g,
          '',
        )}<br /><br /><hr style="border: none; border-top: 2px solid #e0e0e0; width: 80%; margin: 15px auto;" /><br />`
      : '') +
    `<div style="text-align: center; margin: 32px 0 28px 0;">
      <div style="font-weight: 600; font-size: 15px; margin-bottom: 5px; letter-spacing: 0.4px;">Click here to securely cast your vote:</div><a href="${link}" style="font-weight: 500; color: #0066cc; text-decoration: underline; font-size: 16px; letter-spacing: 0.2px; word-break: break-all; line-height: 1.6;">${link}</a>
    </div>
    <div style="text-align: center;">
      <em style="font-size: 13px; opacity: 0.6; color: #666; font-style: italic;">This link is unique for you. Don't share it with anyone.</em>
    </div>`

  return sendEmail({
    from,
    preheader: `Click here to securely cast your vote: ${link}`,
    recipient: voter,
    subject: subject_line,
    tag,
    text: emailBody,
  })
}
