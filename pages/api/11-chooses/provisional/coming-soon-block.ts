import { allowCors } from 'api/_cors'
import { pushover } from 'api/_services'
import { NextApiResponse } from 'next'

export default allowCors(async (req: unknown, res: NextApiResponse) => {
  await pushover('11c/provisional-coming-soon', 'request received')
  return res.status(200).json({ success: true })
})
