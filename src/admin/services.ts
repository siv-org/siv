import Firebase from 'firebase-admin'
import Mailgun from 'mailgun-js'

const {
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
  MAILGUN_API_KEY,
  PUSHOVER_APP_TOKEN,
  PUSHOVER_USER_KEY,
} = process.env

// Init firebase
try {
  Firebase.initializeApp({
    credential: Firebase.credential.cert({
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY,
      projectId: FIREBASE_PROJECT_ID,
    }),
    databaseURL: 'https://siv-demo.firebaseio.com',
  })
} catch (error) {
  // We skip the "already exists" message which is
  // not an actual error when we're hot-reloading.
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error', error.stack)
  }
}
export const firebase = Firebase

/** Init mailgun */
export const mailgun = Mailgun({ apiKey: MAILGUN_API_KEY as string, domain: 'secureinternetvoting.org' })

/** Helper function to use Pushover */
export const pushover = (title: string, message: string) =>
  fetch('https://api.pushover.net/1/messages.json', {
    body: JSON.stringify({ message, title, token: PUSHOVER_APP_TOKEN, user: PUSHOVER_USER_KEY }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
