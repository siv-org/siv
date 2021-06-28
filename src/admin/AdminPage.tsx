import { useRouter } from 'next/router'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AllYourElections } from './AllYourElections'
import { useLoginRequired, useUser } from './auth'
import { BallotDesign } from './BallotDesign/BallotDesign'
import { HeaderBar } from './HeaderBar'
import { ElectionOverview } from './Overview/ElectionOverview'
import { Sidebar } from './Sidebar'
import { Trustees } from './Trustees/Trustees'
import { AddVoters } from './Voters/AddVoters'

export const AdminPage = (): JSX.Element => {
  const { loading, loggedOut } = useUser()
  const { section } = useRouter().query

  useLoginRequired(loggedOut)

  if (loading || loggedOut) return <p style={{ fontSize: 21, padding: '1rem' }}>Loading...</p>
  return (
    <>
      <Head title="Create new election" />

      <HeaderBar />
      <main>
        <Sidebar />
        <div className="content">
          <AllYourElections />
          {/* <h1>{election_title ? `Manage: ${election_title}` : 'Create New Election'}</h1>
          <ElectionID /> */}
          {section === 'overview' && <ElectionOverview />}
          {section === 'trustees' && <Trustees />}
          {section === 'ballot-design' && <BallotDesign />}
          {section === 'voters' && <AddVoters />}
        </div>
      </main>

      <style jsx>{`
        main {
          width: 100%;
          margin: 0 auto;
          display: flex;
        }

        .content {
          padding: 1rem;
          width: 100%;
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
