import { NextApiRequest, NextApiResponse } from 'next'

import { firebase } from './_services'
import { Election } from './admin-all-elections'
import { checkJwt } from './validate-admin-jwt'

type Account = { grants?: { amount: number; created_at: { _seconds: number } }[] }
type History = { amount: number; date: string; description: string; type: 'grant' | 'usage' | 'purchase' }
export type BillingStats = {
  credits_on_hold: number
  credits_remaining: number
  credits_used: number
  history: History[]
  num_total_elections: number
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Confirm they're a valid admin
  const jwt = checkJwt(req, res)
  if (!jwt.valid) return

  // Begin preloading
  const adminDoc = firebase.firestore().collection('admins').doc(jwt.email).get()
  const electionsDocs = firebase.firestore().collection('elections').where('creator', '==', jwt.email).get()

  // Get any grants given to this admin
  const { grants } = { ...(await adminDoc).data() } as Account

  const history: History[] = []
  let total_credits = 0

  grants?.forEach((grant) => {
    total_credits += grant.amount
    history.push({
      amount: grant.amount,
      date: new Date(grant.created_at._seconds * 1000).toISOString(),
      description: 'Gift from David Ernst. Enjoy!',
      type: 'grant',
    })
  })

  let credits_on_hold = 0
  let credits_used = 0
  let num_total_elections = 0

  // Find all elections created by this admin
  await Promise.all(
    (await electionsDocs).docs.map(async (doc) => {
      num_total_elections += 1

      const e = { id: doc.id, ...doc.data() } as Election

      const eDoc = firebase.firestore().collection('elections').doc(e.id)

      // Calculate num invited
      if (!e.num_voters) {
        const voters = await eDoc.collection('voters').get()
        e.num_voters = voters.docs.length
        await eDoc.update({ num_voters: voters.docs.length })
      }

      // Calculate votes used
      if (!e.num_votes) {
        const votes = await eDoc.collection('votes').get()
        e.num_votes = votes.docs.length
        await eDoc.update({ num_votes: votes.docs.length })
      }

      credits_on_hold += e.num_voters - e.num_votes
      credits_used += e.num_votes
    }),
  )

  const credits_remaining = total_credits - credits_used - credits_on_hold
  // const history: History[] = [
  //   {
  //     amount: 100,
  //     date: '6/3/2021',
  //     description: 'Purchased for $200',
  //     type: 'purchase',
  //   },
  //   {
  //     amount: -70,
  //     date: '5/27/2021',
  //     description: 'Used in *San Francisco Election*',
  //     type: 'usage',
  //   },
  // ]

  const billing_stats: BillingStats = { credits_on_hold, credits_remaining, credits_used, history, num_total_elections }

  res.status(200).send(billing_stats)
}
