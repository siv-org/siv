import { firebase } from 'api/_services'
import { GetServerSideProps } from 'next'

import { VotePage } from '../../../src/vote/VotePage'

export default VotePage

// ponytail: only the title for OG/iMessage scrapers; page still loads full info client-side
export const getServerSideProps: GetServerSideProps = async (context) => {
  const election_id = context.params?.election_id as string
  const data = election_id
    ? (await firebase.firestore().collection('elections').doc(election_id).get()).data()
    : undefined

  return {
    props: {
      election_title: data?.election_title ?? null,
      query: context.query,
    },
  }
}
