import { GlobalCSS } from 'src/GlobalCSS'
import { Head } from 'src/Head'
import { Footer } from 'src/homepage/Footer'
import { TailwindPreflight } from 'src/TailwindPreflight'

import { HeaderBar } from '../faq/HeaderBar'

export const HackSIV = (): JSX.Element => {
  return (
    <>
      <Head title="Hack SIV" />
      <HeaderBar />

      <main className="p-4 text-[#060067] w-full overflow-x-hidden">
        <div className="max-w-[750px] mx-auto mb-20">
          <div className="text-[24px] font-bold">Hack SIV</div>

          {/* What to find vulnerabilities for */}
          <div className="px-5 py-3 mt-3 rounded-lg bg-blue-500/10">
            <p className="mb-4">
              In order to make the Secure Internet Voting Protocol (
              <a href="https://docs.siv.org" rel="noreferrer" target="_blank">
                docs.siv.org
              </a>
              ) as secure as possible, we explicitly encourage and reward anyone who discovers and Responsibly Discloses
              (see details below) any exploit to:
            </p>

            <ol className="py-2 pl-8 pr-4 space-y-1 list-decimal shadow-md bg-blue-500/20 rounded-xl">
              <li>Vote multiple times</li>
              <li>Change someone else{"'"}s vote, without them being able to detect the change</li>
              <li>Destroy a vote that{"'"}s been confirmed submitted</li>
              <li>Obtain proof how a particular voter voted</li>
            </ol>

            <p className="mt-3">...without the other voter{"'"}s cooperation.</p>
          </div>

          {/* Reward */}

          <div className="py-5">
            <div className="px-5 py-3 mt-3 text-center rounded-lg bg-purple-500/10">
              All <b>new</b> discoveries will be rewarded monetarily & publicly celebrated on a Wall of Fame.
              <p className="py-2 pl-2 mt-2 space-y-1 font-bold text-center list-decimal shadow-md bg-purple-500/20 rounded-xl">
                Current Prize Pool Available: $10,000
              </p>
            </div>
          </div>

          {/* Responsible Disclosure */}
          <div className="px-5 py-3 mt-3 rounded-lg bg-gray-500/10">
            <b>Responsible Disclosure</b> strict requirements:
            <ol className="py-2 pl-8 pr-4 mt-2 space-y-1 list-decimal shadow-md bg-gray-500/20 rounded-xl">
              <li>
                Your exploit must be privately disclosed to <a href="mailto:security@siv.org">security@siv.org</a>. This
                must include the original intended behavior, what you changed it to, and how you did so.
              </li>
              <li>
                You must give us at least 3 months (from when you provide your exploit details above) to investigate &
                attempt to patch, before public disclosure. If you violate this, your public reward will be forfeited.
              </li>
            </ol>
            <p className="mt-4 text-sm text-blue-900/60">
              We strongly encourage exploit Proof-of-Concepts to be as limited in quantity and impact as possible. For
              example, just a single vote, even if it could apply to millions, and not in a close race, where possible.
            </p>
          </div>
        </div>
        <Footer />
      </main>
      <TailwindPreflight />
      <GlobalCSS />
    </>
  )
}
