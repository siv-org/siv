import ReactMarkdown from 'react-markdown'

import { State } from './vote-state'

export const Instructions = ({ state }: { state: State }) => (
  <>
    {state.custom_invitation_text && (
      <div className="p-4 mb-6 bg-blue-50 rounded-r-lg border-0 border-l-4 border-blue-200 border-solid shadow-sm">
        <h3 className="font-semibold">From {state.election_manager}:</h3>
        <div className="font-medium leading-relaxed text-gray-700">
          <ReactMarkdown>{state.custom_invitation_text}</ReactMarkdown>
        </div>
      </div>
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
