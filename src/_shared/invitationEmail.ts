import { marked } from 'marked'

import { sanitizeInvitationHtml } from './sanitizeInvitationHtml'

export const buildSubject = (election_title?: string) => `Vote Invitation${election_title ? `: ${election_title}` : ''}`

export function buildEmailHtml({
  custom_email_headerbar,
  preheader,
  text,
}: {
  custom_email_headerbar?: string
  preheader?: string
  text: string
}) {
  return `<body style="background-color: #f5f5f5; padding: 2em 0.5em;">
    <table align="center" style="text-align: left; max-width: 600px; background-color: white;">
        <tr>
          <td align="center" style="text-align:center; background: linear-gradient(90deg, #010b26 0%, #072054 100%);">
          ${preheader ? buildPreheader(preheader) : ''}
            <span style="font-size: 17px; font-weight: 700; color: white; line-height: 50px; text-decoration: none;">
              ${custom_email_headerbar || 'SIV.org'}
            </span>
          </td>
        </tr>
        <tr style="display: block; margin: 30px;">
          ${text.replace(/\n/g, '<br />')}
        </tr>
      </table></body>`
}

export async function buildInvitationBody({
  custom_text,
  link,
  subject_line,
}: {
  custom_text?: string
  link: string
  subject_line: string
}) {
  // Use custom text if provided, otherwise use default
  return (
    `<h2 style="margin: 0;">${subject_line.replace(/^\[TEST \d\d:\d\d\] /, '')}</h2>` +
    (custom_text?.trim()
      ? `${sanitizeInvitationHtml(
          (await marked(custom_text)).replaceAll(/\n/g, ''),
        )}<br /><br /><hr style="border: none; border-top: 2px solid #e0e0e0; width: 50%; margin: 15px auto;" /><br />`
      : '') +
    // WARNING: siv/demo: src/demo/interactiveDemo/steps/invite/Email.tsx embeds this and monkey-patches the link. Make sure you're not breaking it if you modify this email template
    `<div style="font-weight: 500; font-size: 16px; margin-top: 15px; margin-bottom: 5px; letter-spacing: 0.4px;">Click here to securely cast your vote:</div><a href="${link}" style="font-weight: 600; color: #0066cc; text-decoration: underline; font-size: 16px; letter-spacing: 0.2px; word-break: break-all; line-height: 1.6;">${link}</a>

    <em style="font-size: 13px; opacity: 0.6; font-style: italic;">This link is unique for you. Don't share it with anyone.</em>`
  )
}

const buildPreheader = (preheader: string) =>
  `<div style="display:none!important;visibility:hidden!important;mso-hide:all!important;font-size:1px;overflow:hidden!important;display:none!important;">${preheader}</div>`
