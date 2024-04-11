import Router from 'next/router'
import { useState } from 'react'
import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'

import { useLoginRequired, useUser } from '../auth'
import { HeaderBar } from '../HeaderBar'
import { CreateNewConvention } from './CreateNewConvention'
import { QRCode } from './QRCode'

export const ConventionsOverviewPage = () => {
  const [numVoters, setNumVoters] = useState<string>()

  const { loading, loggedOut } = useUser()
  useLoginRequired(loggedOut)
  if (loading || loggedOut) return <p className="p-4 text-[21px]">Loading...</p>

  return (
    <>
      <Head title="Your Conventions" />

      <HeaderBar />
      <main className="p-4 sm:px-8 overflow-clip">
        <h2>Manage Your Conventions</h2>
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

          {/*
          <b className="block mt-3 mb-0 font-semibold">Lets you redirect to different elections throughout the day</b>
          <ul>
            <li>Reusable voter credentials</li>
            <li>Collect votes in seconds</li>
            <li>End-to-end Verification</li>
          </ul> */}
        </figure>

        <CreateNewConvention />

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
