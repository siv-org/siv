/* Track client analytics

On page load, store:
    - [x] created_at timestamp
    - [x] what is the page url
    - [x] what is the visitor's IP address
    - [x] What is their browser
    - [x] What is their operating system
    - [x] What language is their browser
    - [x] Do they have a #hash in the url?
    - [x] How long did they stay on page? -- in api/unload
    - [ ] What is their screen resolution
    - [ ] What page referred them?
*/

import { NextApiRequest, NextApiResponse } from 'next'
import UAParser from 'ua-parser-js'

import { pushover } from './_services'
import { supabase } from './_supabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { headers } = req
  const { hash } = req.body

  const domain = headers.origin || ''
  const page_url = headers.referer?.slice(domain.length)
  const ip = headers['x-forwarded-for']
  const ua = UAParser(headers['user-agent'])
  const lang = headers['accept-language']

  // return res.status(200).send('disabled insert for testing')

  const { data, error } = await supabase.from('analytics').insert({
    browser_name: ua.browser.name,
    browser_ver: ua.browser.version,
    domain,
    hash,
    ip,
    lang,
    os_name: ua.os.name,
    os_ver: ua.os.version,
    page_url,
  })

  if (error) {
    await pushover('Error inserting analytics', JSON.stringify(error))
    console.log('Analytics error:', error)
    return res.status(204).send('')
  }

  if (data && data[0]) {
    // console.log(data)
    const { id } = data[0]
    return res.status(200).send(id)
  }
}
