/* Track time on page */

import { round } from 'lodash-es'
import { NextApiRequest, NextApiResponse } from 'next'

import { pushover } from './_services'
import { supabase } from './_supabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { i: id } = req.query
  const now = new Date()

  // console.log('Analytics unload:', id)
  // return res.status(200).send('disabled update for testing')

  const { data, error: selectError } = await supabase.from('analytics').select('created_at').eq('id', id).single()

  if (selectError) {
    await pushover('Error, analytics unload', JSON.stringify(selectError))
    console.log('Analytics unload select error:', selectError)
    return res.status(204).send('')
  }

  const created_at = new Date(data.created_at)
  const sec_on_page = round((now.getTime() - created_at.getTime()) / 1000, 1)
  // console.log('sec_on_page', sec_on_page)

  const { error: updateError } = await supabase.from('analytics').update({ sec_on_page }).eq('id', id)
  if (updateError) {
    await pushover('Error, analytics unload', JSON.stringify(updateError))
    console.log('Analytics unload update error:', updateError)
    return res.status(204).send('')
  }

  // if (data) console.log(data)

  res.status(200).send('Success')
}
