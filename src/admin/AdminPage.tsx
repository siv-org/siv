import { useRouter } from 'next/router'

import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AllYourElections } from './AllYourElections'
import { useLoginRequired, useUser } from './auth'
import { BallotDesign } from './BallotDesign/BallotDesign'
import { CreateNewElection } from './CreateNewElection'
import { HeaderBar } from './HeaderBar'
import { MarkedBallots } from './MarkedBallots/MarkedBallots'
import { MobileMenu } from './MobileMenu'
import { Observers } from './Observers/Observers'
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
      <main className="flex w-full">
        <Sidebar />
        <div
          className="w-full p-4 overflow-auto absolute top-[66px] right-0 bottom-0 sm:left-[215px] sm:px-8 sm:w-auto"
          id="main-content"
        >
          <MobileMenu />

          {!election_id && (
            <>
              <AllYourElections />
              <CreateNewElection />
            </>
          )}

          {section === 'observers' && <Observers />}
          {section === 'ballot-design' && <BallotDesign />}
          {section === 'voters' && <AddVoters />}
          {section === 'marked-ballots' && <MarkedBallots />}
        </div>
      </main>
      <GlobalCSS />
      <style global jsx>{`
        body {
          overflow: hidden;
        }
      `}</style>
    </>
  )
}
