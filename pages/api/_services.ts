import Firebase from 'firebase-admin'
import Mailgun, { AttachmentParams } from 'mailgun-js'
import { buildEmailHtml } from 'src/_shared/invitationEmail'

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
if (!Firebase.apps.length) {
  Firebase.initializeApp({
    credential: Firebase.credential.cert({
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY,
      projectId: FIREBASE_PROJECT_ID,
    }),
    databaseURL: FIREBASE_DATABASE_URL || 'https://siv-demo.firebaseio.com',
    storageBucket: `${FIREBASE_PROJECT_ID || 'siv-demo'}.appspot.com`,
  })
  // Skip nested undefined instead of throwing on writes
  Firebase.firestore().settings({ ignoreUndefinedProperties: true })
}
export const firebase = Firebase.app()

const firebaseStorageBucketName = () =>
  process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID || 'siv-demo'}.appspot.com`

export const storageBucket = () => firebase.storage().bucket(firebaseStorageBucketName())

type SerializedTimestamp = { _seconds: number }
/** `new Date()`, which Firebase will automatically serialize into `{ _seconds: number }` */
export const newSerializedTimestamp = () => new Date() as unknown as SerializedTimestamp

/** Init mailgun */
export const mailgun = Mailgun({
  apiKey: MAILGUN_API_KEY as string,
  domain: MAILGUN_DOMAIN || 'siv.org',
})

export const sendEmail = ({
  attachment,
  bcc,
  custom_email_headerbar,
  from,
  fromEmail,
  preheader,
  recipient,
  subject,
  tag,
  text,
}: {
  attachment?: AttachmentParams
  bcc?: string
  custom_email_headerbar?: string
  from?: string
  fromEmail?: string
  preheader?: string
  recipient: string
  subject: string
  tag?: string
  text: string
}) => {
  if (recipient.includes('@test.local'))
    return new Promise((resolve) => {
      console.log('Skipping mailgun send for test.local recipient', recipient)
      resolve(true)
    })
  if (recipient.includes('@example.'))
    return new Promise((resolve) => {
      console.log('Skipping mailgun send for @example. recipient', recipient)
      resolve(true)
    })

  return mailgun
    .messages()
    .send({
      attachment: !attachment ? undefined : new mailgun.Attachment(attachment),
      bcc,
      from: `${from || 'SIV Admin'} <${fromEmail || 'election@siv.org'}>`,
      html: buildEmailHtml({ custom_email_headerbar, preheader, text }),
      'o:tag': tag,
      subject,
      to: recipient,
    })
    .catch((error) => {
      // console.error('Error sending email:', error)
      if (error.message.includes('Domain sandbox')) console.log({ from, recipient, subject, text })

      throw error
    })
}

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
