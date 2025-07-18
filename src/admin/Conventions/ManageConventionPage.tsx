import Link from 'next/link'
import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import { useLoginRequired, useUser } from '../auth'
import { HeaderBar } from '../HeaderBar'
import { CreateVoterCredentials } from './CreateVoterCredentials'
import { ListOfQRSets } from './ListOfQRSets'
import { QRFigure } from './QRFigure'
import { SetRedirection } from './SetRedirection'
import { useConventionID } from './useConventionID'
import { useConventionInfo } from './useConventionInfo'

export const ManageConventionPage = () => {
  const { convention_id } = useConventionID()
  const { convention_title } = useConventionInfo()

  const { loading, loggedOut } = useUser()
  useLoginRequired(loggedOut)
  if (loading || loggedOut || !convention_title) return <p className="p-4 text-[21px]">Loading...</p>
  if (!convention_id) return <p>Convention ID error</p>

  return (
    <>
      <Head title={`Manage${convention_title ? `: ${convention_title}` : '  Convention'}`} />

      <HeaderBar />
      <main className="p-4 overflow-clip sm:px-8">
        {/* Back link */}
        <Link href="/admin/conventions" className="block mt-2 opacity-60 transition hover:opacity-100">
          ← Back to all Conventions
        </Link>

        {/* Title */}
        <h2>Manage: {convention_title}</h2>

        {/* Set # voters */}
        <CreateVoterCredentials {...{ convention_id }} />

        {/* List of voter sets */}
        <ListOfQRSets />

        <QRFigure {...{ convention_id }} className="mt-12 -ml-5" />

        {/* Set redirection */}
        <SetRedirection />
      </main>

      <GlobalCSS />
    </>
  )
}
