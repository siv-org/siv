import { useState } from 'react'

export const HowDoesItWork = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="w-full max-w-xs">
      <button
        className={`p-2 w-full max-w-xs font-medium bg-sky-100 rounded-md text-black/75 hover:bg-sky-200 active:bg-sky-300 ${
          isOpen ? 'rounded-b-none' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        How does it work?
      </button>

      {isOpen && (
        <div className="px-0.5 pt-3.5 pb-6 w-full text-center shadow-lg max-w-xs border">
          <section>
            <span className="p-1 mr-2.5 text-xs font-medium border border-purple-500 rounded-md text-purple-700/90">
              Setup
            </span>
            <span className="mr-14 text-xs font-medium uppercase">Pick your</span>
            <ol className="flex justify-around mt-1.5 w-full">
              <li>
                <span className="inline-flex justify-center items-center mr-1.5 w-7 h-7 font-semibold text-green-800 text-sm bg-green-200 rounded-full">
                  1
                </span>
                Voters List
              </li>
              <li>
                <span className="inline-flex justify-center items-center mr-1.5 w-7 h-7 font-semibold text-orange-800 text-sm bg-orange-200 rounded-full">
                  2
                </span>
                Question(s)
              </li>
            </ol>
          </section>

          <section className="px-2 pt-4 mt-4 border-t border-gray-400/70">
            <span className="text-xs font-medium uppercase">Voting Period</span>
            <ul className="mt-2 text-xs list-disc list-inside text-left">
              <li>Voters can vote from own devices in seconds</li>
              <li>Everyone can see encrypted votes arrive in real-time</li>
            </ul>
            <div className="mt-3 text-xs italic">
              <p>&quot;The easiest voting experience I&apos;ve ever had&quot; - A voter</p>
              <p className="mt-1">&quot;Like voting nirvana&quot; - An election official</p>
            </div>
          </section>

          <section className="px-2 pt-4 mt-4 border-t border-gray-400/70">
            <span className="text-xs font-medium uppercase">Verifiable Results</span>
            <ul className="mt-2 text-xs list-disc list-inside text-left">
              <li>Administrators can prove they&apos;re not cheating</li>
              <li>Voters can confirm own votes are counted as intended</li>
              <li>Voter Roll auditable against fake voters, ballot stuffing</li>
            </ul>
            <p className="mt-3 text-xs font-medium">Advanced protections against Malware, Coercion, False Claims</p>
          </section>
        </div>
      )}
    </div>
  )
}
