import { useState } from 'react'

import { ExploreSection, ExploreTopic } from '../../shared/ExploreSection'
import { PrimaryButton } from '../../shared/PrimaryButton'
import { PostalLetter } from './PostalLetter'

type ExploreTopicId = 'delivery' | 'identity'

export function Invite({ auth, onContinue, voteLink }: { auth: string; onContinue: () => void; voteLink: string }) {
  const [layers, setLayers] = useState(() => new Set<string>())
  const [topic, setTopic] = useState<ExploreTopicId | null>(null)
  const authLayers = [
    ['Signature', 'Compare a signature drawn on screen with the signature on file.'],
    ['Photo ID + selfie', 'Compare the voter’s selfie with the photo on their government ID.'],
    ['SSN / government ID number', 'Check an identification number against the voter’s registration record.'],
    ['Text message code', 'Send a one-time code to the voter’s registered phone number.'],
    ['Authenticator app code', 'Ask for a time-based code from an authenticator app set up in advance.'],
    ['IP location', 'Flag unexpected connection locations for review.'],
  ]

  return (
    <div>
      <PostalLetter auth={auth} onContinue={onContinue} voteLink={voteLink} />

      <div className="flex justify-end mt-5">
        <PrimaryButton disabled={!auth} onClick={onContinue}>
          Open ballot
        </PrimaryButton>
      </div>

      <ExploreSection>
        <div className="mt-3 space-y-2">
          <ExploreTopic
            className="w-full"
            onClick={() => setTopic(topic === 'delivery' ? null : 'delivery')}
            open={topic === 'delivery'}
            subtitle="Familiar vote-by-mail procedures, with a digital voting option"
            title="Why deliver Voter Codes via Postal Mail?"
          />
          {topic === 'delivery' && (
            <div className="p-4 rounded-xl bg-h26-bg">
              <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
                Postal mail lets SIV follow familiar US vote-by-mail procedures for delivering voter credentials, while
                the ballot is returned online. Election administrators can choose other methods to meet their election’s
                requirements.
              </p>
              <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
                If voters receive ballots via mail, election administrators can simply add the Voter Codes as an
                additional option for voters to cast their vote digitally.
              </p>
            </div>
          )}

          <ExploreTopic
            className="w-full"
            onClick={() => setTopic(topic === 'identity' ? null : 'identity')}
            open={topic === 'identity'}
            subtitle="Methods to receive Voter Code & additional identity checks"
            title="Other ways to identify voters"
          />
          {topic === 'identity' && (
            <div className="p-4 rounded-xl bg-h26-bg">
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  [
                    'Digital Government Credentials',
                    'Authenticate voters using pre-distributed public/private key pairs: Common Access Card for active-duty service members, digital IDs like in EU, and government apps.',
                  ],
                  ['Email', 'Send each voter their unique Voter Code link by email: simple & affordable.'],
                  ['In person', 'Give each eligible voter their code in person. E.g. for in-person conventions.'],
                ].map(([label, description]) => (
                  <div className="px-3 py-2 bg-white rounded-lg border border-black/[0.07]" key={label}>
                    <p className="text-[0.76rem] font-medium text-h26-text">{label}</p>
                    <p className="mt-0.5 text-[0.68rem] text-h26-textSecondary">{description}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[0.8rem] leading-relaxed text-h26-textSecondary">
                Each voter needs their Voter Code to cast a vote. How that code reaches them is the first identity
                check. For example, sending it by postal mail to the address on their voter registration record.
              </p>
              <p className="mt-4 text-[0.8rem] font-semibold leading-relaxed text-h26-textSecondary">
                Election admins can then require additional checks:
              </p>
              <div className="grid gap-2 mt-2 sm:grid-cols-2">
                {authLayers.map(([label, description]) => (
                  <button
                    aria-pressed={layers.has(label)}
                    className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                      layers.has(label)
                        ? 'border-h26-green/40 bg-white text-h26-text'
                        : 'border-black/[0.07] bg-white/60 text-h26-textSecondary hover:border-h26-green/30'
                    }`}
                    key={label}
                    onClick={() =>
                      setLayers((prev) => {
                        const next = new Set(prev)
                        if (next.has(label)) next.delete(label)
                        else next.add(label)
                        return next
                      })
                    }
                    type="button"
                  >
                    <span className="block text-[0.76rem] font-medium">
                      {layers.has(label) ? '✓ ' : '+ '}
                      {label}
                    </span>
                    <span className="mt-0.5 block text-[0.68rem] opacity-70">{description}</span>
                  </button>
                ))}
              </div>
              {layers.size > 0 && (
                <p className="mt-3 text-[0.72rem] text-h26-textSecondary">Selected checks: {[...layers].join(' + ')}</p>
              )}
              <p className="mt-3 text-[0.72rem] leading-relaxed text-h26-textSecondary">
                Each check has trade-offs in accessibility, or protection against impersonation. SIV&apos;s design can
                match each election&apos;s custom authentication requirements.
              </p>
            </div>
          )}
        </div>
      </ExploreSection>
    </div>
  )
}
