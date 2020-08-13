import { NextApiRequest, NextApiResponse } from 'next'

import { mailgun } from '../../src/admin/services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { vote } = req.body

  // 1. TODO Validate auth token
  if (!vote?.auth) {
    return res.status(401).end('Invalid Auth Token.')
  }

  // 2. TODO Store the encrypted vote in db

  // 3. TODO Email the voter their submission receipt
  const link = `www.secureinternetvoting.org/demo-election-results`

  await mailgun.messages().send({
    from: 'SIV Admin <admin@secureinternetvoting.org>',
    html: `Your vote has been received. Thank you.

The final results will be posted at <a href="${link}">${link}</a> when the election closes.

Here is the encrypted vote you submitted:

<code style="margin: 0 30px;">${JSON.stringify(vote)}</code>

<em style="font-size:10px">If you did not submit this ballot, <a>click here</a> to report a problem.</em>`.replace(
      /\n/g,
      '<br />',
    ),
    subject: 'Vote Confirmation',
    to: 'admin@secureinternetvoting.org',
  })

  res.status(200).end('Success.')
}
