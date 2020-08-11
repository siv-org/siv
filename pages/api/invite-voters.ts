import firebase from 'firebase-admin'
import Mailgun from 'mailgun-js'
import { NextApiRequest, NextApiResponse } from 'next'
const {
  ADMIN_PASSWORD,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
  MAILGUN_API_KEY,
  PUSHOVER_APP_TOKEN,
  PUSHOVER_USER_KEY,
} = process.env

// Init firebase
try {
  firebase.initializeApp({
    credential: firebase.credential.cert({
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

// Init mailgun
const mailgun = Mailgun({ apiKey: MAILGUN_API_KEY as string, domain: 'secureinternetvoting.org' })

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // 1. Check for password
  const { password, voters } = req.body
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).end('Invalid Password.')
  }

  // 2. Generate vote token for each voter
  const tokens = voters.map(() => generateToken())

  // 3. Store the vote tokens in db
  voters.forEach((voter: string, index: number) => {
    firebase
      .firestore()
      .collection('elections')
      .doc(Number(new Date()).toString())
      .collection('voters')
      .doc(voter)
      .set({ email: voter, token: tokens[index] })
  })

  // 4. Email each voter their token
  voters.slice(-1).forEach((voter: string, index: number) => {
    const link = `www.secureinternetvoting.org/demo-election?id=${tokens[index]}`
    mailgun.messages().send({
      from: 'SIV Admin <admin@secureinternetvoting.org>',
      html: `Voting for the Best Ice Cream is now open.

Votes accepted for the next 24 hours.

Click here to securely cast your vote:
<a href="${link}">${link}</a>

<em style="font-size:10px">This link is unique for you. Don't share it with anyone, or they'll be able to take your vote.</em>`.replace(
        /\n/g,
        '<br />',
      ),
      subject: 'Vote Invitation',
      to: 'admin@secureinternetvoting.org',
    })
  })

  // 5. Send Admin push notification
  await fetch('https://api.pushover.net/1/messages.json', {
    body: JSON.stringify({
      message: 'foobar',
      title: `Invited ${voters.length} voters`,
      token: PUSHOVER_APP_TOKEN,
      user: PUSHOVER_USER_KEY,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  res.status(200).end('Success.')
}

function generateToken() {
  const random = Math.random()
  const integer = String(random).slice(2)
  const hex = Number(integer).toString(16)
  const token = hex.slice(0, 10)
  return token
}
