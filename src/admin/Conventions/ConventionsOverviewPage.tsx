import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import { useLoginRequired, useUser } from '../auth'
import { HeaderBar } from '../HeaderBar'
import { AllYourConventions } from './AllYourConventions'
import { CreateNewConvention } from './CreateNewConvention'
import { QRFigure } from './QRFigure'

export const ConventionsOverviewPage = () => {
  const { loading, loggedOut } = useUser()
  useLoginRequired(loggedOut)
  if (loading || loggedOut) return <p className="p-4 text-[21px]">Loading...</p>

  return (
    <>
      <Head title="Your Conventions" />

      <HeaderBar />
      <main className="max-w-2xl p-4 mx-auto sm:px-8 overflow-clip">
        <div className="text-center">
          <h2>SIV Conventions</h2>
          <p>Create re-usable login credentials for voters to use across multiple ballots in a single day.</p>

          <QRFigure className="mb-12" />
        </div>

        <CreateNewConvention />

        <AllYourConventions />
      </main>

      <GlobalCSS />
    </>
  )
}
