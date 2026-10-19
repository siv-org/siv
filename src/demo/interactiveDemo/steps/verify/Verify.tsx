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
              ['roll', 'Were extra votes stuffed in?', 'Each row ties to a registered Voter Code'],
              ['others', 'Did other voters check?', 'A spot check of the roll'],
              ['software', 'Do we have to trust the software?', 'The published list is the record'],
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
        {topic === 'roll' && (
          <div className="p-4 mt-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              {boardVotes.length} submissions, each accepted against one registered Voter Code. A stuffed ballot would
              need a Voter Code that was never issued.
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
      </ExploreSection>

      <PrimaryButton className="mt-6" onClick={onDone}>
        Finish
      </PrimaryButton>
    </div>
  )
}
