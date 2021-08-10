import { NextApiRequest, NextApiResponse } from 'next'

import { firebase, pushover, sendEmail } from './_services'
import { pusher } from './pusher'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, skip_init_email_validation } = req.body

  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing ID' })

  // Lookup this doc in `applied-admins` db
  const doc = await firebase.firestore().collection('applied-admins').doc(id).get()
  // Stop if we can't find doc
  if (!doc.exists) {
    await pushover('admin-approval failure', `Bad applied-admin id: ${id}`)
    return res.status(400).json({ error: 'Invalid application ID' })
  }

  const data = { ...doc.data() }

  const new_admin_doc = { approved_at: new Date(), name: `${data.first_name} ${data.last_name}`, ...data }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (!skip_init_email_validation) delete new_admin_doc.init_login_code

  // Make a doc for them in approved `admins` DB
  await firebase.firestore().collection('admins').doc(data.email).create(new_admin_doc)

  // Delete their applied-admin doc
  await firebase.firestore().collection('applied-admins').doc(id).delete()

  // Notify CreatedAccountWaiting frontend if it's still open
  pusher.trigger(`admin-${data.email}`, 'approved', '')

  // Send them an email with their login instructions
  sendEmail({
    from: 'David Ernst',
    fromEmail: 'david@secureinternetvoting.org',
    recipient: data.email,
    subject: 'SIV Account Approved',
    text: `<h2 style="margin-bottom: 0;">SIV Account Approved</h2>
Congratulations, you now have the ability to create Secure Internet Voting elections.

You can login anytime at <b><a href="https://login.secureinternetvoting.org">login.secureinternetvoting.org</a></b>`,
  })

  // If they still have the Waiting Page open, show that they've been approved

  res.status(200).send('Success')
}
