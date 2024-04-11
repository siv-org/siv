import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import { useLoginRequired, useUser } from '../auth'
import { HeaderBar } from '../HeaderBar'
import { AllYourConventions } from './AllYourConventions'
import { CreateNewConvention } from './CreateNewConvention'
import { QRCode } from './QRCode'

export const ConventionsOverviewPage = () => {
  const { loading, loggedOut } = useUser()
  useLoginRequired(loggedOut)
  if (loading || loggedOut) return <p className="p-4 text-[21px]">Loading...</p>

  return (
    <>
      <Head title="Your Conventions" />

      <HeaderBar />
      <main className="p-4 sm:px-8 overflow-clip">
        <h2>SIV Conventions</h2>
        <p>Create re-usable login credentials for voters to use across multiple votes in a single day.</p>

        <figure className="mx-0 mb-12">
          <div className="flex items-center">
            <div className="text-center">
              <QRCode className="relative scale-75 top-3" />
              <span className="text-xs opacity-70">QR code</span>
            </div>
            <i
              className="pl-3 pr-6 text-[30px] opacity-80"
              style={{ fontFamily: '"Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {'→'}
            </i>{' '}
            <i className="relative top-0.5 overflow-auto break-words">
              siv.org/c/{new Date().getFullYear()}/:conv_id/:voter_id
            </i>
          </div>
        </figure>

        <CreateNewConvention />

        <AllYourConventions />
      </main>

      <GlobalCSS />
    </>
  )
}
