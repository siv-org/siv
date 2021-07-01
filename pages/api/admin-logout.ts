import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'

import { cookie_name } from '../../src/admin/auth'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Overwrite authentication cookie
  const cookies = new Cookies(req, res)
  cookies.set(cookie_name, '', { expires: new Date('Thu, 01 Jan 1970 00:00:01 GMT;') })

  return res.status(200).send({ message: 'Success! Setting jwt cookie.' })
}
