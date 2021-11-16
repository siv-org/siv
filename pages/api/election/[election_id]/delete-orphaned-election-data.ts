import bluebird from 'bluebird'
import { NextApiRequest, NextApiResponse } from 'next'
import { firebase } from 'pages/api/_services'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(401).json({ message: 'Disabled' })

  // Goal: Delete orphaned election data

  //   // Find orphaned election data
  //   // - Find all elections still in firestore
  //   const all_elections = (await firebase.firestore().collection('elections').listDocuments()).map(
  //     (i) => i._path.segments[1],
  //   )

  //   // - Look if there is a corresponding election doc
  //   const results = await bluebird
  //     .mapSeries(all_elections, async (e_id) => {
  //       const doc = await firebase.firestore().collection('elections').doc(e_id).get()

  //       // - if NOT, that means this collection was orphaned
  //       if (!doc.exists) {
  //         return e_id
  //       }
  //     })
  //       .filter((i) => !!i)

  // Copying in results from a previous run of this function to avoid re-running query
  const orphaned = [
    '1636493514252',
    '1636494212774',
    '1636836697301',
    '1636836750736',
    '1636836763849',
    '1636836900086',
    '1636837832800',
    '1636837938058',
    '1636838435602',
    '1636838501565',
    '1636840782343',
    '1636842177568',
    '1636843380477',
    '1636844153379',
    '1636846410895',
    '1636846906394',
    '1636847205604',
    '1636847330645',
    '1636847391366',
    '1636847434431',
    '1636848281498',
    '1636849619663',
    '1636849787742',
    '1636850117509',
    '1636850215419',
    '1636850285683',
    '1636850584042',
    '1636850688634',
    '1636850766821',
    '1636851208618',
    '1636851258400',
    '1636857590248',
    '1637021129628',
    '1637021184359',
    '1637033470491',
    '1637033575189',
    '1637033641529',
    '1637034272948',
  ]

  // Delete orphaned election data
  const results = await bluebird.mapSeries(orphaned, async (e_id) => {
    const doc = firebase.firestore().collection('elections').doc(e_id)

    return bluebird.map(['trustees', 'voters', 'votes'], async (collection) => {
      // Get then delete all docs in the collection
      const trusteeDocs = (await doc.collection(collection).get()).docs
      return { [collection]: await bluebird.map(trusteeDocs, (doc) => doc.ref.delete()) }
    })
  })

  res.status(201).json({ count: results.length, message: results })
}
