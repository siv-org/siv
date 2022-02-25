/* Track client analytics

On page load, store:
    - [x] created_at timestamp
    - [x] what is the page url
    - [x] what is the visitor's IP address
    - [x] What is their browser
    - [x] What is their operating system
    - [x] What language is their browser
    - [ ] Do they have any #hashtags in the url?
    - [ ] What page referred them?
    - [ ] How long did they stay on page?
    - [ ] What is their screen resolution
*/

import { NextApiRequest, NextApiResponse } from 'next'
import UAParser from 'ua-parser-js'

import { pushover } from './_services'
import { supabase } from './_supabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { headers } = req

  const domain = headers.origin || ''
  const page_url = headers.referer?.slice(domain.length)
  const ip = headers['x-forwarded-for']
  const ua = UAParser(headers['user-agent'])
  const lang = headers['accept-language']

  console.log(headers)

  const { error } = await supabase.from('analytics').insert({
    browser_name: ua.browser.name,
    browser_ver: ua.browser.version,
    domain,
    ip,
    lang,
    os_name: ua.os.name,
    os_ver: ua.os.version,
    page_url,
  })

  if (error) {
    pushover('Error inserting analytics', JSON.stringify(error))
    console.log('ERROR!', error)
  }

  // if (data) console.log(data)

  res.status(200).send('Success')
}
