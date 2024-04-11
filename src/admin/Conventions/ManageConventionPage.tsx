import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { api } from 'src/api-helper'
import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'
import TimeAgo from 'timeago-react'

import { useLoginRequired, useUser } from '../auth'
import { HeaderBar } from '../HeaderBar'
import { QRFigure } from './QRFigure'
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
  if (typeof convention_id !== 'string') return <p>Convention ID error</p>

  return (
    <>
      <Head title="Manage Convention" />

      <HeaderBar />
      <main className="p-4 sm:px-8 overflow-clip">
        <Link href="/admin/conventions">
          <a className="block mt-2 transition opacity-60 hover:opacity-100">← Back to all Conventions</a>
        </Link>
        <h2>Manage: {convention_title}</h2>

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

        {/* List of voter sets */}
        <ol className="inset-0 pl-6 mt-0 ml-0">
          {voters?.map(({ createdAt, number }, i) => (
            <li key={i}>
              <span className="inline-block w-20">Set of {number} </span>
              <Link href={`/admin/conventions/download?n=${number}`} target="_blank">
                <a className="pl-1" target="_blank">
                  Download
                </a>
              </Link>
              <span className="inline-block w-32 text-[13px] text-right opacity-60">
                {+new Date() - +new Date(createdAt._seconds * 1000) < 60 * 1000 ? (
                  'Just now'
                ) : (
                  <TimeAgo datetime={new Date(createdAt._seconds * 1000)} />
                )}{' '}
              </span>
            </li>
          ))}
        </ol>

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
