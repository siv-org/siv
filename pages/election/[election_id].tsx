import { firebase } from 'api/_services'
import { GetServerSideProps } from 'next'

import { ElectionStatusPage } from '../../src/status/ElectionStatusPage'

export default ElectionStatusPage

// ponytail: only the title for OG/iMessage scrapers; page still loads full info client-side
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const election_id = params?.election_id as string
  if (!election_id) return { props: {} }

  const data = (await firebase.firestore().collection('elections').doc(election_id).get()).data()
  return { props: { election_title: data?.election_title ?? null } }
}
