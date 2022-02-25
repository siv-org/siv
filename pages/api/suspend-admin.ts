import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'

const suspensionEnabled = false

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // This endpoint is not meant to be accessible anywhere other than locally
  if (!suspensionEnabled || req.headers.host !== 'localhost:3000') return res.status(404).send('Not found')

  // Will need to URL encode these fields, using a tool like https://www.urlencoder.io
  const { id, suspended_for } = req.query

  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing ID' })
  if (!suspended_for || typeof suspended_for !== 'string')
    return res.status(400).json({ error: 'Missing suspended_for' })

  // Lookup this doc in `admins` db
  const doc = await firebase.firestore().collection('admins').doc(id).get()
  // Stop if we can't find doc
  if (!doc.exists) return res.status(400).json({ error: `Can't find admin: ${id}` })

  const data = { ...doc.data() }

  const new_doc = { suspended_at: new Date(), suspended_for, ...data }

  // Uncomment for testing
  // return res.status(200).json(new_doc)

  // Make a doc for them in suspended `admins` DB
  await firebase.firestore().collection('suspended-admins').doc(data.email).create(new_doc)

  // Delete their admin doc
  await firebase.firestore().collection('admins').doc(id).delete()

  res.status(200).send(`Successfully suspended ${id}`)
}
