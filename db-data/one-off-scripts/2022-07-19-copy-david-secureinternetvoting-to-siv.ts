// Execute this file with:
// npx ts-node db-data/2022-07-19-copy-david-secureinternetvoting-to-siv.ts

import '../_env'

import bluebird from 'bluebird'

import { firebase } from '../../pages/api/_services'

;(async () => {
  // Find all elections created by david@secureinternetvoting.org
  const elections = (
    await firebase.firestore().collection('elections').where('creator', '==', 'david@secureinternetvoting.org').get()
  ).docs

  console.log(`Found ${elections.length} elections`)

  // Update creator to david@siv.org
  await bluebird.mapSeries(elections, async (doc) => {
    const e = { ...doc.data(), id: doc.id }
    // console.log(e)
    await firebase.firestore().doc(`elections/${e.id}`).update({ creator: 'david@siv.org' })
  })
  // console.log(`Updated ${found}`)
  console.log('Done 👍')
})()
