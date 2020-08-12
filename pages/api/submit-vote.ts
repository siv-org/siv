import { NextApiRequest, NextApiResponse } from 'next'

import { mailgun } from '../../src/admin/services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth } = req.body

  // 1. TODO Validate auth token
  if (!auth) {
    return res.status(401).end('Invalid Auth Token.')
  }

  // 2. TODO Store the encrypted vote in db

  // 3. TODO Email the voter their submission receipt
  mailgun.messages().send({
    from: 'SIV Admin <admin@secureinternetvoting.org>',
    html: `Voting for the Best Ice Cream is now open.

Votes accepted for the next 24 hours.

Click here to securely cast your vote:

<em style="font-size:10px">This link is unique for you. Don't share it with anyone, or they'll be able to take your vote.</em>`.replace(
      /\n/g,
      '<br />',
    ),
    subject: 'Vote Invitation',
    to: 'admin@secureinternetvoting.org',
  })

  res.status(200).end('Success.')
}
