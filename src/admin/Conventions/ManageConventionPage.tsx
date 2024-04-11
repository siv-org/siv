import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import { useState } from 'react'
import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import { useLoginRequired, useUser } from '../auth'
import { HeaderBar } from '../HeaderBar'
import { QRCode } from './QRCode'
import { useConventionInfo } from './useConventionInfo'

export const ManageConventionPage = () => {
  const [numVoters, setNumVoters] = useState<string>()
  const {
    query: { convention_id },
  } = useRouter()
  const { convention_title } = useConventionInfo()

  const { loading, loggedOut } = useUser()
  useLoginRequired(loggedOut)
  if (loading || loggedOut) return <p className="p-4 text-[21px]">Loading...</p>

  return (
    <>
      <Head title="Manage Convention" />

      <HeaderBar />
      <main className="p-4 sm:px-8 overflow-clip">
        <Link href="/admin/conventions">
          <a className="block mt-2 transition opacity-60 hover:opacity-100">← Back to all Conventions</a>
        </Link>
        <h2>Manage: {convention_title}</h2>

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
              siv.org/c/{new Date().getFullYear()}/{convention_id}/:voter_id
            </i>
          </div>
        </figure>

        {/* Set # voters */}
        <div>
          <label>Create how many voter credentials?</label>
          <input
            className="w-20 ml-3 text-lg"
            min="0"
            placeholder="200"
            type="number"
            value={numVoters}
            onChange={(e) => setNumVoters(e.target.value)}
          />

          <button className="block" onClick={() => Router.push(`/admin/conventions/download?n=${numVoters}`)}>
            Download your{numVoters ? ` ${numVoters}` : ''} unique QR codes
          </button>
        </div>

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
