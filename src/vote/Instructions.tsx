import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { State } from './vote-state'

export const Instructions = ({ election_id, state }: { election_id: string; state: State }) => {
  const [showA11cNotice, setShowA11cNotice] = useState(true)

  return (
    <>
      {election_id === a11cTest3 && showA11cNotice && (
        <div className="mt-3 mb-3">
          <div className="flex items-start px-4 py-3 text-sm text-yellow-900 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
            <p className="leading-relaxed">
              <span className="font-semibold">⚠️ Important:</span> Due to a printing & mailing error, households with 4
              or more voters didn&apos;t receive all their Voter Code invitations. If yours was affected, those voters
              can still cast a Provisional Ballot at{' '}
              <a
                className="font-medium underline text-blue-500/80"
                href="https://11.siv.org/vote"
                rel="noreferrer"
                target="_blank"
              >
                11.siv.org/vote
              </a>
              . We’re very sorry for the inconvenience.
            </p>
            <button
              aria-label="Dismiss important notice"
              className="ml-3 text-lg leading-none text-yellow-700 hover:text-yellow-900"
              onClick={() => setShowA11cNotice(false)}
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {state.custom_invitation_text && (
        <>
          {!hideElectionCreatedByLine.includes(election_id) && (
            <h3 className="font-semibold">Election created by {state.election_manager?.trim()}:</h3>
          )}

          <div className="p-4 mb-6 rounded-r-lg border-0 border-l-4 border-blue-100 border-solid shadow-sm bg-blue-50/20">
            <div className="font-medium leading-relaxed text-gray-700">
              <ReactMarkdown
                components={{
                  a: ({ children, href, ...props }) => (
                    <a href={href} rel="noreferrer" target="_blank" {...props}>
                      {children}
                    </a>
                  ),
                }}
              >
                {state.custom_invitation_text}
              </ReactMarkdown>
            </div>
          </div>
        </>
      )}

      <p>
        <b>Instructions:</b> Mark your selections then press <em>Submit</em> at the bottom.
      </p>
      <p>
        <img className="relative mr-[7px] top-[3px] opacity-90" src="/vote/lock.png" width="12px" />
        Your choices are encrypted on your own device for strong privacy.{' '}
        <span className="mt-0 text-black/50 sm:pl-5 sm:block">
          No one will see how you vote. Everyone will see vote totals.{' '}
          <a
            className="underline text-inherit hover:text-black/80"
            href="https://docs.siv.org/privacy"
            rel="noreferrer"
            target="_blank"
          >
            Learn more
          </a>
        </span>
      </p>
    </>
  )
}

const a11cTest = '1764804420871'
const a11cTest2 = '1764868041998'
const a11cTest3 = '1765426466660'
const live11c = '1764187291234'
const hideElectionCreatedByLine = [a11cTest, a11cTest2, a11cTest3, live11c]
