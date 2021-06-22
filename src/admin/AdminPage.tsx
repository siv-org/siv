import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { ElectionLabel } from './1-Label/ElectionLabel'
import { AllYourElections } from './AllYourElections'
import { useLoginRequired, useUser } from './auth'
import { BallotDesign } from './BallotDesign/BallotDesign'
import { ElectionID } from './ElectionID'
import { HeaderBar } from './HeaderBar'
import { Trustees } from './Trustees/Trustees'
import { useStored } from './useStored'
import { AddVoters } from './Voters/AddVoters'

export const AdminPage = (): JSX.Element => {
  const { loading, loggedOut } = useUser()
  const { ballot_design, election_manager, election_title, threshold_public_key } = useStored()

  useLoginRequired(loggedOut)

  if (loading || loggedOut) return <p style={{ fontSize: 21, padding: '1rem' }}>Loading...</p>
  return (
    <>
      <Head title="Create new election" />

      <HeaderBar />
      <main>
        <AllYourElections />
        <h1>{election_title ? `Manage: ${election_title}` : 'Create New Election'}</h1>
        <ElectionID />
        <ElectionLabel />
        {election_manager && <Trustees />}
        {threshold_public_key && <BallotDesign />}
        {ballot_design && <AddVoters />}
      </main>

      <style jsx>{`
        main {
          max-width: 775px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        h1 {
          margin-top: 0;
          font-size: 22px;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
