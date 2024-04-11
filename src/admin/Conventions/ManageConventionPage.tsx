import Link from 'next/link'
import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import { useLoginRequired, useUser } from '../auth'
import { HeaderBar } from '../HeaderBar'
import { CreateVoterCredentials } from './CreateVoterCredentials'
import { ListOfVoterSets } from './ListOfVoterSets'
import { QRFigure } from './QRFigure'
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
      <main className="p-4 sm:px-8 overflow-clip">
        {/* Back link */}
        <Link href="/admin/conventions">
          <a className="block mt-2 transition opacity-60 hover:opacity-100">← Back to all Conventions</a>
        </Link>

        {/* Title */}
        <h2>Manage: {convention_title}</h2>

        {/* Set # voters */}
        <CreateVoterCredentials {...{ convention_id }} />

        {/* List of voter sets */}
        <ListOfVoterSets />

        <QRFigure {...{ convention_id }} />

        {/* Set redirection */}
        <div className="">
          <h3>Redirect your convention QR codes to which ballot?</h3>
          <select>
            <option>Menu of your current elections</option>
          </select>
        </div>
      </main>

      <GlobalCSS />
    </>
  )
}
