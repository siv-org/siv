import './_env'

import { firebase } from '../pages/api/_services'

const election_id = '1680323766282'
const auth = ''

;(async () => {
  const vote = await firebase
    .firestore()
    .collection('elections')
    .doc(election_id)
    .collection('votes')
    .where('auth', '==', auth)
    .get()

  console.log('Found:', vote.docs.length)

  const data = { ...vote.docs[0].data(), id: vote.docs[0].id }

  console.log(data)
})()
