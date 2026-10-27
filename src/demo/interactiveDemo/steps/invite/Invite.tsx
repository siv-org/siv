import { useState } from 'react'
import { generateAuthToken } from 'src/crypto/generate-auth-tokens'

import { ExploreGroup, ExploreSection, ExploreTopic } from '../../shared/ExploreSection'
import { PrimaryButton } from '../../shared/PrimaryButton'
import { SecondaryButton } from '../../shared/SecondaryButton'
import { PostalLetter } from './PostalLetter'

type ExploreTopicId = 'access' | 'attack' | 'bruteForce' | 'delivery' | 'identity' | 'recovery'

export function Invite({ auth, onContinue, voteLink }: { auth: string; onContinue: () => void; voteLink: string }) {
  const [attack, setAttack] = useState<'lost' | 'used' | null>(null)
  const [layers, setLayers] = useState(() => new Set<string>())
  const [remediated, setRemediated] = useState(false)
  const [replacementAuth] = useState(() => generateAuthToken())
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

        <ExploreGroup title="Safeguards">
          <div className="grid grid-flow-row-dense gap-2 mt-3 sm:grid-cols-2">
            <ExploreTopic
              onClick={() => setTopic(topic === 'attack' ? null : 'attack')}
              open={topic === 'attack'}
              subtitle="Stolen invitations, compromised accounts, and unauthorized use"
              title="What if someone else uses my Voter Code?"
            />
            {topic === 'attack' && (
              <div className="p-4 rounded-xl bg-h26-bg sm:col-span-2">
                <p className="text-[0.78rem] font-medium text-h26-text">Replace a compromised credential</p>
                <p className="mt-2 text-[0.75rem] leading-relaxed text-h26-textSecondary">
                  An election administrator can revoke a Voter Code and issue a replacement after re-authenticating the
                  voter. Try a scenario to see the steps.
                </p>
                <p className="mt-3 text-[0.75rem] leading-relaxed text-h26-textSecondary">
                  A code could be taken from an invitation, a compromised email account, or an infected device.
                  Additional identity checks can make the code alone insufficient to vote. The protocol also includes an
                  acceptance confirmation, which can alert a voter to a submission they did not make.
                </p>
                <p className="mt-3 text-[0.75rem] leading-relaxed text-h26-textSecondary">
                  If you receive an unexpected confirmation or find your code already used, contact the election office
                  through a known official channel. The administrator can investigate and follow the documented
                  revocation and replacement process. This demo does not send confirmation messages.
                </p>
                <p className="mt-4 text-[0.75rem] font-medium text-h26-text">Try a scenario</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    ['lost', 'Voter Code lost or stolen'],
                    ['used', 'Someone voted first'],
                  ].map(([id, label]) => (
                    <button
                      aria-pressed={attack === id}
                      className={`rounded-full border px-3 py-2 text-[0.72rem] transition-colors ${
                        attack === id
                          ? 'border-h26-green/40 bg-white font-medium text-h26-green'
                          : 'border-black/10 bg-white/60 text-h26-textSecondary hover:border-h26-green/30'
                      }`}
                      key={id}
                      onClick={() => {
                        setAttack(id as 'lost' | 'used')
                        setRemediated(false)
                      }}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {attack && !remediated && (
                  <div className="pl-3 mt-4 border-l-2 border-red-300">
                    <p className="text-[0.78rem] font-medium text-red-800">
                      {attack === 'lost'
                        ? 'Until it is revoked, whoever holds the Voter Code could try to vote.'
                        : 'The one-use rule rejects your attempt because the Voter Code was already used.'}
                    </p>
                    <p className="mt-2 text-[0.75rem] leading-relaxed text-h26-textSecondary">
                      The admin re-authenticates the voter, invalidates the old credential and any linked submission,
                      then issues a replacement. Every change leaves an audit trail.
                    </p>
                    <SecondaryButton className="mt-3" onClick={() => setRemediated(true)}>
                      Revoke + issue replacement
                    </SecondaryButton>
                  </div>
                )}

                {attack && remediated && (
                  <div className="px-3 py-3 mt-4 bg-white rounded-lg border border-h26-green/30">
                    <p className="text-[0.78rem] font-medium text-h26-green">Replacement issued</p>
                    <p className="mt-2 font-mono26 text-[0.72rem] text-h26-muted line-through">Old: {auth}</p>
                    <p className="mt-1 font-mono26 text-[0.78rem] text-h26-text">Replacement: {replacementAuth}</p>
                    <p className="mt-2 text-[0.7rem] text-h26-textSecondary">
                      The old Voter Code is rejected; the voter can cast once with the replacement.
                    </p>
                  </div>
                )}
              </div>
            )}

            <ExploreTopic
              onClick={() => setTopic(topic === 'recovery' ? null : 'recovery')}
              open={topic === 'recovery'}
              subtitle="Lost invitations, identity checks, and auditable corrections"
              title="What if my invitation is missing or I need a replacement?"
            />
            {topic === 'recovery' && (
              <div className="p-4 rounded-xl bg-h26-bg sm:col-span-2">
                <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
                  An invitation can be lost, delayed, discarded, or sent to an outdated address. This can prevent a
                  voter from participating even if nobody uses the code. Contact the election office through a known
                  official channel to check your registration details and request help.
                </p>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
                  Before issuing a replacement, the administrator must re-check the voter’s identity. Someone pretending
                  to be the voter could otherwise use the recovery process to take over their credentials. The old code
                  must be invalidated so it cannot be used alongside the replacement.
                </p>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
                  If a submitted ballot needs correction, the documented process calls for a written request from the
                  voter and a visible record of invalidation. A linked encrypted submission can be invalidated before a
                  replacement is accepted. Correction procedures and deadlines depend on the election’s rules.
                </p>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
                  The authentication docs describe revocation after tallying, while the remediation page treats problems
                  discovered after close separately. Post-close handling needs review; this example does not promise
                  that a voter can cast a replacement at any time.
                </p>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
                  Audit records must also expose unauthorized revocations or replacements. An administrator’s ability to
                  revoke a code is a power that needs oversight, not proof that every revocation is justified.
                </p>
              </div>
            )}

            <ExploreTopic
              onClick={() => setTopic(topic === 'access' ? null : 'access')}
              open={topic === 'access'}
              subtitle="Delivery failures, changed records, and service disruption"
              title="What if someone blocks invitations or access to voting?"
            />
            {topic === 'access' && (
              <div className="p-4 rounded-xl bg-h26-bg sm:col-span-2">
                <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
                  An attacker does not need to cast a fraudulent vote to affect participation. Withholding invitations,
                  changing registered contact details, or disrupting the voting website or its authentication services
                  can prevent eligible people from voting.
                </p>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
                  Election administration needs ways to detect delivery failures, review registration changes, restore
                  service, and help affected voters before deadlines. In-person and mail options can provide
                  alternatives when available; neither a replacement code nor an accurate tally alone proves that
                  everyone had an opportunity to vote.
                </p>
              </div>
            )}
            <ExploreTopic
              onClick={() => setTopic(topic === 'bruteForce' ? null : 'bruteForce')}
              open={topic === 'bruteForce'}
              subtitle="Random codes, rate limits, and monitoring"
              title="Could someone brute-force Voter Codes?"
            />
            {topic === 'bruteForce' && (
              <div className="p-4 rounded-xl bg-h26-bg sm:col-span-2">
                <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
                  Brute-forcing means trying many possible codes until one works. Voter Codes are generated using
                  cryptographically secure randomness. The 10-character hexadecimal format has over a trillion possible
                  values, so knowing one voter’s code does not let someone predict another’s.
                </p>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
                  A large code space is only part of the protection. Online guessing also needs rate limits and
                  monitoring to restrict repeated attempts, including attempts spread across many IP addresses. The
                  number of valid codes in an election also affects the chance that a random guess matches one.
                </p>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
                  Unknown, revoked, and already-used codes are rejected. Additional identity checks can require more
                  than a valid code before accepting a vote. Participation audits provide a separate way to investigate
                  whether the intended voters actually cast the recorded ballots.
                </p>
              </div>
            )}
          </div>
        </ExploreGroup>
      </ExploreSection>
    </div>
  )
}
