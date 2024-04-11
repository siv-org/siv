import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { api } from 'src/api-helper'
import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'
import TimeAgo from 'timeago-react'

import { useLoginRequired, useUser } from '../auth'
import { HeaderBar } from '../HeaderBar'
import { QRCode } from './QRCode'
import { SaveButton } from './SaveButton'
import { useConventionInfo } from './useConventionInfo'

export const ManageConventionPage = () => {
  const [numVoters, setNumVoters] = useState<string>('')
  const {
    query: { convention_id },
  } = useRouter()
  const { convention_title, voters } = useConventionInfo()

  const { loading, loggedOut } = useUser()
  useLoginRequired(loggedOut)
  if (loading || loggedOut || !convention_title) return <p className="p-4 text-[21px]">Loading...</p>

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
            min="1"
            placeholder="200"
            type="number"
            value={numVoters}
            onChange={(e) => setNumVoters(e.target.value)}
          />
          <SaveButton
            disabled={!numVoters}
            text="Create"
            onPress={async () => {
              await api(`/conventions/${convention_id}/add-voters`, { numVoters: Number(numVoters) })
            }}
          />
        </div>
        <ol className="mt-0">
          {voters?.map(({ createdAt, number }, i) => (
            <li key={i}>
              <span>
                {+new Date() - +new Date(createdAt._seconds * 1000) < 60 * 1000 ? (
                  'Just now'
                ) : (
                  <TimeAgo datetime={new Date(createdAt._seconds * 1000)} />
                )}
                :{' '}
              </span>
              Set of {number}{' '}
              <Link href={`/admin/conventions/download?n=${number}`}>
                <a className="pl-1">Download</a>
              </Link>
            </li>
          ))}
        </ol>

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
