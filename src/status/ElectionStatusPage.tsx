import { useRouter } from 'next/router'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Footer } from '../vote/Footer'
import { AcceptedVotes } from './AcceptedVotes'
import { DecryptedVotes } from './DecryptedVotes'
import { useBallotDesign } from './use-ballot-design'

export const ElectionStatusPage = (): JSX.Element => {
  const { election_id } = useRouter().query as { election_id?: string }
  const ballot_design = useBallotDesign(election_id)

  return (
    <>
      <Head title="Election Status" />

      <main>
        <h1>Election Status</h1>
        <p>
          ID: <b>{election_id}</b>
        </p>
        <DecryptedVotes {...{ ballot_design }} />
        <AcceptedVotes {...{ ballot_design }} />
        <Footer />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
          overflow-wrap: break-word;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
