import './_env'

import UAParser from 'ua-parser-js'

import { firebase } from '../pages/api/_services'

const election_id = '1680323766282'

const expectedSelections = 4

;(async function main() {
  const db = firebase.firestore()
  const electionDoc = db.collection('elections').doc(election_id)

  // Download all submitted encrypted votes
  const votesDocs = await electionDoc.collection('votes').get()

  // Look through each, if it has any holes, mark the auth_token and number of holes
  const votesWithHoles: Record<string, { device: string; holes: number }> = {}
  votesDocs.docs.forEach((doc) => {
    const { auth, encrypted_vote, headers } = doc.data()
    const holes = expectedSelections - Object.keys(encrypted_vote).length
    if (holes) {
      const ua = UAParser(headers['user-agent'])

      votesWithHoles[auth] = {
        device: `${ua.browser.name} ${ua.browser.version} on ${ua.os.name} ${ua.os.version}`,
        holes,
      }
    }
  })

  // Console log the list of all auth token votes with holes
  console.log('Votes with holes:')
  console.log(votesWithHoles)

  // And how many for each number of holes
  const holesSummary = {}
  Object.values(votesWithHoles).forEach(({ holes }) => {
    const key = `${holes} hole${holes !== 1 ? 's' : ''}`
    holesSummary[key] = (holesSummary[key] || 0) + 1
  })
  console.log(holesSummary)
})()
