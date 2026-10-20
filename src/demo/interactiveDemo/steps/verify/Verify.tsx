import { keyBy, orderBy } from 'lodash-es'
import { Fragment, useState } from 'react'
import { HowDoIVerify } from 'src/status/HowDoIVerify'
import { HowSubmittedVotesWork } from 'src/status/HowSubmittedVotesWork'
import { Animation } from 'src/status/Mixnet/Animation'
import { RoundResults } from 'src/status/RoundResults'
import { tallyVotes } from 'src/status/tally-votes'
import { unTruncateSelection } from 'src/status/un-truncate-selection'
import { range } from 'src/utils'
import { generateColumnNames } from 'src/vote/generateColumnNames'

import { ballotDesignFor, OTHER_VOTERS } from '../../content'
import { UnlockedVote } from '../../demoState'
import { fakeCipherParts } from '../../shared/ciphertext'
import { ExpandableHex } from '../../shared/ExpandableHex'
import { ExploreSection, ExploreTopic } from '../../shared/ExploreSection'
import { splitChoices } from '../../shared/formatChoice'
import { PrimaryButton } from '../../shared/PrimaryButton'

export function Verify({
  boardVotes,
  onDone,
  unlocked,
}: {
  boardVotes: { auth: string; cipher: string; name: string; yours: boolean }[]
  onDone: () => void
  unlocked: UnlockedVote[]
}) {
  const [stuffing, setStuffing] = useState<'guess' | 'reuse' | 'roll' | null>(null)
  const [topic, setTopic] = useState<null | string>(null)
  const [showEncrypted, setShowEncrypted] = useState(false)
  const [openHex, setOpenHex] = useState<null | string>(null)
  const design = ballotDesignFor('approval')
  const votes = unlocked.map((v) => {
    const row: Record<string, string> = { tracking: v.verification }
    splitChoices(v.choice).forEach((name, i) => {
      row[`vote_${i + 1}`] = name
    })
    return row
  })
  const ballot_design = [design]
  const { columns } = generateColumnNames({ ballot_design })
  const { ordered, tallies: itemTallies } = tallyVotes(keyBy(ballot_design, 'id'), votes)
  const sorted = orderBy(votes, 'tracking')

  return (
    <div>
      {/* Same pieces as Election Status: totals, decrypted table, mixnet. Shell is demo-only. */}
      <div className="-mx-4 bg-[hsl(0,0%,95%)] px-4 py-5 sm:-mx-8 sm:px-8">
        <div className="flex gap-3 justify-between items-baseline">
          <h2 className="m-0 text-2xl font-semibold text-black">Election Status</h2>
          <p className="m-0 text-sm text-black/70">
            ID: <b>demo</b>
          </p>
        </div>
        <h3 className="mt-3 mb-4 text-lg font-semibold text-black">City Mayoral Election</h3>

        <div className="p-4 bg-white rounded-lg shadow-[0px_1px_2px_hsl(0_0%_50%/_0.333),0px_3px_4px_hsl(0_0%_50%/_0.333),0px_4px_6px_hsl(0_0%_50%/_0.333)]">
          <h3 className="mt-0">Vote Totals:</h3>
          <h4>{design.title}</h4>
          <RoundResults
            ballot_design={ballot_design}
            id="vote"
            ordered={ordered.vote}
            tallies={itemTallies.vote}
            totalVotes={votes.length}
          />
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg shadow-[0_2px_2px_hsla(0,0%,50%,0.333),0_4px_4px_hsla(0,0%,50%,0.333),0_6px_6px_hsla(0,0%,50%,0.333)]">
          <h3 className="mt-0 mb-1.5">Decrypted Votes</h3>
          <p className="mt-0 text-[13px] italic opacity-70">Anonymized for vote secrecy.</p>
          <HowDoIVerify />
          <table className="block overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px] pb-2">
            <thead>
              <tr className="text-[11px]">
                <th></th>
                <th style={{ backgroundColor: 'rgba(10, 232, 10, 0.24)' }}>verification #</th>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((vote, voteIndex) => (
                <tr key={vote.tracking}>
                  <td>{voteIndex + 1}.</td>
                  <td>{vote.tracking?.padStart(14, '0')}</td>
                  {columns.map((c) => (
                    <td className="text-center" key={c}>
                      {unTruncateSelection(vote[c], ballot_design, c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-xs opacity-70">
          <button onClick={() => setShowEncrypted((v) => !v)} type="button">
            {showEncrypted ? '[-] Hide' : '[+] Show'} Encrypted Submissions
          </button>
        </p>

        {showEncrypted && (
          <>
            <section className="p-4 mt-4 mb-8 bg-white rounded-lg shadow-[0px_2px_2px_hsl(0_0%_50%_/_0.333),0px_4px_4px_hsl(0_0%_50%_/_0.333),0px_6px_6px_hsl(0_0%_50%_/_0.333)]">
              <h3 className="m-0 mb-[5px]">Anonymization Mixnet</h3>
              <p className="mt-0 text-[13px] italic opacity-70">
                This animation illustrates how the encrypted votes were anonymized by the Election&apos;s Privacy
                Protectors before being unlocked.
              </p>
              <Animation observers={range(1, 6).map((i) => `Privacy Protector #${i}`)} />
            </section>

            <section className="p-4 mb-8 bg-white rounded-lg shadow-[0px_2px_2px_hsl(0_0%_50%_/_0.333),0px_4px_4px_hsl(0_0%_50%_/_0.333),0px_6px_6px_hsl(0_0%_50%_/_0.333)]">
              <h3 className="mt-0 mb-1">All Submitted Votes</h3>
              <p className="mt-0 text-sm italic opacity-70">
                Ordered oldest to newest. These are the encrypted votes submitted by each authenticated voter.
              </p>
              <HowSubmittedVotesWork />
              <table className="block pb-2.5 mt-8 overflow-auto border-collapse [&_tr>*]:[border:1px_solid_#ccc] [&_tr>*]:px-2.5 [&_tr>*]:py-[3px] [&_tr>*]:max-w-[227px]">
                <thead className="text-[11px]">
                  <tr>
                    <td rowSpan={2} />
                    <th rowSpan={2}>auth</th>
                    {columns.map((c) => (
                      <th colSpan={2} key={c}>
                        {c}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {columns.map((c) => (
                      <Fragment key={c}>
                        <th>encrypted</th>
                        <th>lock</th>
                      </Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {boardVotes.map((v, index) => (
                    <tr key={v.auth}>
                      <td>{index + 1}.</td>
                      <td>{v.auth}</td>
                      {columns.map((c) => {
                        const parts = fakeCipherParts(`${v.auth}:${c}`)
                        const cell = (kind: 'encrypted' | 'lock', value: string) => {
                          const id = `${v.auth}:${c}:${kind}`
                          return (
                            <td className="align-top" key={id}>
                              <ExpandableHex
                                expanded={openHex === id}
                                onToggle={() => setOpenHex(openHex === id ? null : id)}
                                value={value}
                              />
                            </td>
                          )
                        }
                        return (
                          <Fragment key={c}>
                            {cell('encrypted', parts.encrypted)}
                            {cell('lock', parts.lock)}
                          </Fragment>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>

      <ExploreSection className="mt-8">
        <div className="grid gap-2 mt-3 sm:grid-cols-2">
          {(
            [
              ['count', 'Could the tally be wrong?', 'Anyone can re-add the published votes'],
              ['yours', 'Was my vote changed or dropped?', 'Match the # from your submitted page'],
              ['others', 'Did other voters check?', 'A spot check of the roll'],
              ['software', 'Do we have to trust the software?', 'The published list is the record'],
              [
                'roll',
                'What prevents votes for fake or nonparticipating voters? [draft tbd]',
                'Audit eligibility, participation, and one counted ballot per voter',
              ],
            ] as const
          ).map(([id, title, subtitle]) => {
            const open = topic === id
            return (
              <ExploreTopic
                key={id}
                onClick={() => setTopic(open ? null : id)}
                open={open}
                subtitle={subtitle}
                title={title}
              />
            )
          })}
        </div>

        {topic === 'count' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              The totals above are just addition. Every device that opens this page can add the decrypted votes again. A
              wrong total doesn&apos;t survive that.
            </p>
          </div>
        )}
        {topic === 'yours' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Go back to Vote Submitted. Your verification # is there, on your device — this page doesn&apos;t look it
              up for you. Find that same number in the decrypted votes table and see the choices beside it.
            </p>
          </div>
        )}
        {topic === 'others' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Sampled 2 of {OTHER_VOTERS.length + 1} voters from the roll — both confirmed they cast (scripted for
              demo). Anyone else can do the same check you can.
            </p>
          </div>
        )}
        {topic === 'software' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              The published list is the record. You check it yourself. The computers aren&apos;t the ground truth.
            </p>
          </div>
        )}

        {topic === 'roll' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              [draft tbd] The demo shows {boardVotes.length} submissions associated with registered Voter Codes. A valid
              code alone does not establish that the registered person was eligible or actually cast the ballot. Someone
              could misuse an issued code, or a fake registration could receive a valid code.
            </p>
            <ul className="mt-3 space-y-2 text-[0.8rem] leading-relaxed text-h26-textSecondary">
              <li>
                [draft tbd] Eligibility: check the voter roll against registration evidence and investigate fake,
                duplicate, or improperly removed entries.
              </li>
              <li>
                [draft tbd] Participation: check whether voters associated with recorded submissions actually
                participated. The authentication docs describe contacting a random sample and using device-held
                cryptographic evidence to support those checks without revealing ballot choices.
              </li>
              <li>
                [draft tbd] Uniqueness: reconcile issued, used, revoked, and replacement credentials with participation
                records from digital, in-person, and mail voting. Check that each voter has only one ballot counted.
              </li>
            </ul>
            <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
              [draft tbd] The original voter-to-code-to-encrypted-submission record supports these audits. The shuffle
              separates identities from the final published choices. Access to authentication records follows the
              election’s rules; those records are not automatically public. A published tally alone does not establish
              the accuracy of the voter roll or rule out impersonation.
            </p>
            <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
              [draft tbd] These checks need independent evidence, defined procedures, and oversight of administrator
              actions, including revocations. The scripted spot check in this demo illustrates participation checking;
              it is not a complete audit or evidence that a real election met a statistical risk limit.
            </p>
            <p className="mt-3 text-[0.8rem] leading-relaxed text-h26-textSecondary">
              [draft tbd] An attacker could manipulate registrations or redirect invitations. An insider who knows
              issued codes could also try to vote for people who have not participated. Checks for unknown or reused
              codes address different threats from audits of eligibility and actual participation.
            </p>
            <p className="mt-4 text-[0.75rem] font-medium text-h26-text">Try a scenario</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                ['roll', 'Fake voters on the roll'],
                ['guess', 'Invented Voter Codes'],
                ['reuse', 'Extra submissions'],
              ].map(([id, label]) => (
                <button
                  aria-pressed={stuffing === id}
                  className={`rounded-full border px-3 py-2 text-[0.72rem] transition-colors ${
                    stuffing === id
                      ? 'border-h26-green/40 bg-white font-medium text-h26-green'
                      : 'border-black/10 bg-white/60 text-h26-textSecondary hover:border-h26-green/30'
                  }`}
                  key={id}
                  onClick={() => setStuffing(id as 'guess' | 'reuse' | 'roll')}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            {stuffing && (
              <div className="pl-3 mt-4 border-l-2 border-red-300">
                <p className="text-[0.78rem] font-medium text-red-800">
                  {stuffing === 'roll' && 'Padding the voter roll with fake people.'}
                  {stuffing === 'guess' && 'Trying to invent Voter Codes that were never issued.'}
                  {stuffing === 'reuse' && 'Submitting without a Voter Code, or reusing one already accepted.'}
                </p>
                <p className="mt-2 text-[0.75rem] leading-relaxed text-h26-textSecondary">
                  {stuffing === 'roll' &&
                    'Eligibility is still a voter-roll problem — same as paper. The roll can be audited. SIV does not invent who is allowed to vote; it binds each accepted ciphertext to a registered Voter Code.'}
                  {stuffing === 'guess' &&
                    'Voter Codes are generated by the election admin and infeasible to guess. Submissions with unknown Voter Codes are rejected.'}
                  {stuffing === 'reuse' &&
                    'One Voter Code → one accepted ciphertext. A second use is rejected, and every accepted submission is visible on the public board for audit.'}
                </p>
                <div className="px-3 py-3 mt-3 bg-white rounded-lg border border-h26-green/30">
                  <p className="text-[0.78rem] font-medium text-h26-green">
                    {stuffing === 'roll' && 'Defense: audit the voter roll'}
                    {stuffing === 'guess' && 'Defense: only issued Voter Codes are accepted'}
                    {stuffing === 'reuse' && 'Defense: one Voter Code, one accepted vote'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </ExploreSection>

      <PrimaryButton className="mt-6" onClick={onDone}>
        Finish
      </PrimaryButton>
    </div>
  )
}
