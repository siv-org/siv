import { NextApiRequest, NextApiResponse } from 'next'
import { buildInvitationBody } from 'src/_shared/invitationEmail'

import { sendEmail } from './_services'

const { ACCEPTS_LOCALHOST_EMAILS = 'none set' } = process.env

export default async (req: NextApiRequest, res: NextApiResponse) => res.status(401).send('Deprecated')

export { buildSubject } from 'src/_shared/invitationEmail'

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

  const emailBody = await buildInvitationBody({ custom_text, link, subject_line })

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
