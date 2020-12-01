import { useRouter } from 'next/router'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AcceptedVotes } from './AcceptedVotes'
import { DecryptedVotes } from './DecryptedVotes'

export const ElectionStatusPage = (): JSX.Element => {
  const { election_id } = useRouter().query
  return (
    <>
      <Head title="Election Status" />

      <main>
        <h1>Election Status</h1>
        <p>
          ID: <b>{election_id}</b>
        </p>
        <DecryptedVotes />
        <AcceptedVotes />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
