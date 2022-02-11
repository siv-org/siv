import Firebase from 'firebase-admin'
import Mailgun, { AttachmentParams } from 'mailgun-js'

const {
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_DATABASE_URL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  PUSHOVER_APP_TOKEN,
  PUSHOVER_USER_KEY,
} = process.env

// Init firebase (only once)
export const firebase = !Firebase.apps.length
  ? Firebase.initializeApp({
      credential: Firebase.credential.cert({
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
        projectId: FIREBASE_PROJECT_ID,
      }),
      databaseURL: FIREBASE_DATABASE_URL || 'https://siv-demo.firebaseio.com',
    })
  : Firebase.app()

/** Init mailgun */
export const mailgun = Mailgun({
  apiKey: MAILGUN_API_KEY as string,
  domain: MAILGUN_DOMAIN || 'siv.org',
})

export const sendEmail = ({
  attachment,
  from,
  fromEmail,
  preheader,
  recipient,
  subject,
  text,
}: {
  attachment?: AttachmentParams
  from?: string
  fromEmail?: string
  preheader?: string
  recipient: string
  subject: string
  text: string
}) =>
  mailgun.messages().send({
    attachment: !attachment ? undefined : new mailgun.Attachment(attachment),
    from: `${from || 'SIV Admin'} <${fromEmail || 'election@siv.org'}>`,
    html: `<body style="background-color: #f5f5f5; padding: 2em 0.5em;">
    <table align="center" style="text-align: left; max-width: 600px; background-color: white;">
        <tr>
          <td align="center" style="text-align:center; background: linear-gradient(90deg, #010b26 0%, #072054 100%);">
          ${preheader ? buildPreheader(preheader) : ''}
            <span style="font-size: 17px; font-weight: 700; color: white; line-height: 50px; text-decoration: none;">
              Secure Internet Voting
            </span>
          </td>
        </tr>
        <tr style="display: block; margin: 30px;">
          ${text.replace(/\n/g, '<br />')}
        </tr>
      </table></body>`,
    subject,
    to: recipient,
  })

const buildPreheader = (preheader: string) =>
  `<div style="display:none!important;visibility:hidden!important;mso-hide:all!important;font-size:1px;overflow:hidden!important;display:none!important;">${preheader}</div>`

/** Helper function to use Pushover (admin push notifs) */
export const pushover = (title: string, message: string) =>
  fetch('https://api.pushover.net/1/messages.json', {
    body: JSON.stringify({ message, title, token: PUSHOVER_APP_TOKEN, user: PUSHOVER_USER_KEY }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
