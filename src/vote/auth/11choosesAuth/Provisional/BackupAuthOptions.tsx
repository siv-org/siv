import { PassportScan } from './PassportScan'
import { ProvisionalSubmitted } from './ProvisionalSubmitted'
import { SMSFlow } from './SMSFlow'

export const provisionalAuthDisabled = true

export const BackupAuthOptions = ({ election_id, link_auth }: { election_id: string; link_auth: string }) => {
  if (provisionalAuthDisabled) return <ProvisionalSubmitted />

  return (
    <div className="mx-auto max-w-96">
      <p className="mt-8 text-lg font-medium opacity-50">Step 2 of 2</p>
      <h1 className="mt-1 text-3xl font-bold">Provisional Auth Options</h1>

      <p className="mt-8 text-xl">Lastly, we need to verify you are the person whose name you just submitted.</p>

      <div className="mt-10 text-left">
        <div className="mb-2 text-lg opacity-50">Any of these are acceptable:</div>

        <Details title="SMS + Caller ID Check">
          <div className="text-center">
            <div>Depends on your phone carrier&apos;s CallerID.</div>
            <div className="mt-1 text-sm opacity-50">Works for approx. 1/3 of people</div>
            <SMSFlow />
          </div>
        </Details>

        <Details title="Passport Scan">
          <div className="text-center">
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
