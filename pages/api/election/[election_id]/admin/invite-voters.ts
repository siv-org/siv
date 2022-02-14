import formData from 'form-data'
import Mailgun from 'mailgun.js'
import { NextApiRequest, NextApiResponse } from 'next'
import { firebase, pushover } from 'pages/api/_services'
import { buildSubject } from 'pages/api/invite-voters'
import { checkJwtOwnsElection } from 'pages/api/validate-admin-jwt'

const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env

const mailgun = new Mailgun(formData).client({ key: MAILGUN_API_KEY as string, username: 'api' })

export type QueueLog = { result: string; time: Date }

// !! IMPORTANT NOTE: Recipient Vars for Batch Send don't work for emails that get rewritten by Mailgun Receiving Routes:
// see https://github.com/mailgun/mailgun.js/issues/236

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!MAILGUN_API_KEY) return res.status(401).send({ error: `Missing process.env JWT_SECRET` })

  const { election_id } = req.query as { election_id: string }
  const { voters } = req.body as { voters: string[] }

  // Confirm they're a valid admin that created this election
  const jwt = await checkJwtOwnsElection(req, res, election_id)
  if (!jwt.valid) return

  // Lookup election title
  const electionDoc = firebase.firestore().collection('elections').doc(election_id)
  const { election_manager, election_title } = (await electionDoc.get()).data() as {
    election_manager?: string
    election_title?: string
  }

  const link = `${req.headers.origin}/election/${election_id}/vote?auth=`
  // const link = `https://siv.org/election/${election_id}/vote?auth=` // If we need to manually resend from our computer

  // Don't send localhost emails to non-admins
  if (link.includes('localhost')) {
    const nonAdmin = voters.find((v) => !v.endsWith('@dsernst.com'))
    if (nonAdmin) return res.status(401).send({ error: `Blocking sending 'localhost' email link to ${nonAdmin}` })
  }

  // Gather all voters' auth tokens
  const voters_w_info: {
    auth_token: string
    doc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
    email: string
    invite_queued?: QueueLog[]
  }[] = []
  const errors: string[] = []

  await Promise.all(
    voters.map(async (email: string) => {
      // Lookup voter info
      const doc = electionDoc.collection('voters').doc(email)
      const voter = await doc.get()

      // Make sure we can find voter
      if (!voter.exists) return errors.push(`Can't find voter ${email}`)
      const { auth_token, invite_queued } = {
        ...(voter.data() as { auth_token: string; invite_queued?: QueueLog[] }),
      }

      // Make sure auth_token is well formed
      if (!/(\d|[a-f]){10}$/.test(auth_token))
        return errors.push(`Blocking sending malformed auth invite '${auth_token}' to ${voter}`)

      voters_w_info.push({ auth_token, doc, email, invite_queued })
    }),
  )

  if (errors.length) {
    console.error(errors)

    // If deployed, send to pushover
    if (!link.includes('localhost'))
      pushover(
        `${election_manager} errors when inviting voters`,
        `Election: ${election_title}\nElection ID: ${election_id}\n\n${errors.join('\n')}`,
      )
  }

  // Email each voter their auth token

  const subject_line = buildSubject(election_title)

  const recipientVariables = voters_w_info.reduce(
    (memo, { auth_token, email }) => ({
      ...memo,
      [email]: { link: link + auth_token },
    }),
    {},
  )

  await sendEmail({
    from: election_manager,
    preheader: `Click here to securely cast your vote: %recipient.link%`,
    recipientVariables: JSON.stringify(recipientVariables),
    recipients: voters_w_info.map(({ email }) => email),
    subject: subject_line,
    text: `<h2 style="margin: 0">${subject_line}</h2>
Click here to securely cast your vote: 
<a href="%recipient.link%" style="font-weight: bold;">%recipient.link%</a> 

<em style="font-size:13px; opacity: 0.6;">This link is unique for you. Don't share it with anyone.</em>`,
  })

  // TODO Fix this logic to store the new `invite_queued` records
  // .then((result) => {
  //         console.log(email, result)
  //         // Store queued_log in DB
  //         voter_doc.update({ invite_queued: [...(invite_queued || []), { result, time: new Date() }] })

  //         // Wait a second after sending to not overload Mailgun
  //         return new Promise((res) => setTimeout(res, 1000))
  //       })

  // ).catch((error) => {
  //   throw res.status(400).json({ error })
  // })

  res.status(201).json({ message: 'Done' })
}

export const sendEmail = ({
  from,
  fromEmail,
  preheader,
  recipientVariables,
  recipients: to,
  subject,
  text,
}: {
  from?: string
  fromEmail?: string
  preheader?: string
  recipientVariables: string
  recipients: string[]
  subject: string
  text: string
}) =>
  mailgun.messages.create(MAILGUN_DOMAIN || 'siv.org', {
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
    'recipient-variables': recipientVariables,
    subject,
    to,
  })

const buildPreheader = (preheader: string) =>
  `<div style="display:none!important;visibility:hidden!important;mso-hide:all!important;font-size:1px;overflow:hidden!important;display:none!important;">${preheader}</div>`
