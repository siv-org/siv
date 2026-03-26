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
      <main className="p-4 mx-auto max-w-2xl overflow-clip sm:px-8">
        <div className="text-center">
          <h2>SIV Conventions</h2>
          <p>Create printable QR credentials for voters to re-use across multiple ballots in a single day.</p>

          <QRFigure className="mb-12" />
        </div>

        <CreateNewConvention />

        <AllYourConventions />
      </main>

      <GlobalCSS />
    </>
  )
}
