import { api } from 'src/api-helper'

import { PassportScan } from './PassportScan'
import { SMSNewTab } from './SMS/SMSNewTab'

export const ProvisionalAuthOptions = ({ election_id, link_auth }: { election_id: string; link_auth: string }) => {
  return (
    <div className="pt-8 mx-auto max-w-96">
      {/* <p className="mb-1 text-lg font-medium opacity-50">Step 2 of 2</p> */}
      <h1 className="text-3xl font-bold">Provisional Auth Options</h1>

      <p className="mt-8 text-xl">Lastly, we need to verify you are the person whose name you submitted.</p>

      <div className="mt-10 text-left">
        <div className="mb-2 text-lg opacity-50">Any of these are acceptable:</div>

        <Details title="SMS + Caller ID Check">
          <div className="text-center">
            <div>Depends on your phone carrier&apos;s CallerID.</div>
            <div className="mt-1 mb-4 text-sm opacity-50">Works for approx. 1/3 of people</div>
            <SMSNewTab {...{ election_id, link_auth }} />
          </div>
        </Details>

        <Details title="Passport Scan">
          <div className="text-center">
            {/* New Tech warning */}
            <div className="block p-1 px-3 mx-auto mb-6 text-xs rounded-sm border border-orange-200 text-orange-700/70 bg-yellow-50/50 w-fit">
              New Tech: Expect rough edges
            </div>
            Use your smartphone{"'"}s NFC reader
            <div className="mb-1 text-sm opacity-50">(what powers Apple/Google Pay)</div>
            to validate the e-chip in your passport.
          </div>

          <PassportScan {...{ election_id, link_auth }} />
        </Details>

        <Details title="In-Person">
          <div className="mt-3">
            <div className="text-xl font-medium">
              Visit{' '}
              <a
                className="text-blue-700 hover:underline"
                href="https://www.11chooses.com/#in-person"
                rel="noreferrer noopener"
                target="_blank"
              >
                11chooses.com/#in-person
              </a>{' '}
              for Locations & Times
            </div>

            <div className="mt-3 space-y-2 text-sm opacity-50">
              <p>You don{"'"}t have to vote again.</p>
              <p>A poll worker will check your valid photo ID, and mark your email address as verified.</p>
            </div>
          </div>
        </Details>

        <Details title="Zoom Call + Photo ID verification">
          <div className="text-center">
            <p>Join a Zoom call with a poll worker, and they{"'"}ll verify your photo ID.</p>

            <div
              className="p-2 mx-auto mt-6 bg-red-50 rounded-md border-2 border-red-200 cursor-pointer w-fit hover:bg-red-100"
              onClick={() => {
                window.open('https://11.siv.org/zoom', '_blank')

                api('11-chooses/provisional/zoom-interest', { election_id, link_auth })
              }}
            >
              Link to Zoom
            </div>
            <div className="mt-1 text-sm opacity-50">
              There may be a small wait,
              <br />
              only 1 voter will be let in at a time.
            </div>

            <div className="mt-4 text-sm font-bold">Hours:</div>
            <div>Tues 12/9: 2pm - 8pm</div>
            <div>Wed 12/10: 2pm - 8pm</div>
            <div>Thurs 12/11: 9am - 9pm</div>
          </div>
        </Details>
      </div>
    </div>
  )
}

const Details = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <details className="mb-4 ml-7">
      <summary className="text-[22px] font-medium marker:text-black/70 marker:text-3xl list-outside text-[#111827] leading-[1.5] mb-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer">
        {title}{' '}
      </summary>
      <div className="pb-6 pl-1">{children}</div>
    </details>
  )
}
