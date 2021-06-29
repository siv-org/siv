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
import { usePusher } from './usePusher'
import { AddVoters } from './Voters/AddVoters'

export const AdminPage = (): JSX.Element => {
  const { loading, loggedOut } = useUser()
  const { election_id, section } = useRouter().query

  useLoginRequired(loggedOut)
  usePusher(election_id as string | undefined)

  if (loading || loggedOut) return <p style={{ fontSize: 21, padding: '1rem' }}>Loading...</p>
  return (
    <>
      <Head title="Create new election" />

      <HeaderBar />
      <main>
        <Sidebar />
        <div className="content">
          <AllYourElections />
          {(section === 'overview' || !election_id) && <ElectionOverview />}
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
          padding: 1rem 2rem;
          overflow: scroll;
          position: absolute;
          left: 215px;
          top: 66px;
          bottom: 0;
        }

        h1 {
          margin-top: 0;
          font-size: 22px;
        }
      `}</style>
      <GlobalCSS />
      <style global jsx>{`
        body {
          overflow: hidden;
        }
      `}</style>
    </>
  )
}
