import { useRouter } from 'next/router'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AllYourElections } from './AllYourElections'
import { useLoginRequired, useUser } from './auth'
import { BallotDesign } from './BallotDesign/BallotDesign'
import { HeaderBar } from './HeaderBar'
import { MarkedBallots } from './MarkedBallots/MarkedBallots'
import { MobileMenu } from './MobileMenu'
import { Observers } from './Observers/Observers'
import { ElectionOverview } from './Overview/ElectionOverview'
import { Sidebar } from './Sidebar'
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
        <div id="main-content">
          <MobileMenu />
          <AllYourElections />
          {(section === 'overview' || !election_id) && <ElectionOverview />}
          {section === 'observers' && <Observers />}
          {section === 'ballot-design' && <BallotDesign />}
          {section === 'voters' && <AddVoters />}
          {section === 'marked-ballots' && <MarkedBallots />}
        </div>
      </main>

      <style jsx>{`
        main {
          width: 100%;
          display: flex;
        }

        #main-content {
          padding: 1rem 2rem;
          overflow: auto;
          position: absolute;
          left: 215px;
          top: 66px;
          right: 0;
          bottom: 0;
        }

        /* When sidebar disappears */
        @media (max-width: 500px) {
          #main-content {
            left: 0;

            width: 100%;

            padding: 1rem;
          }
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
