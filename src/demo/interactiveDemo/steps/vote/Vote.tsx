import { useMemo, useState } from 'react'
import { default_multiple_votes_allowed } from 'src/admin/BallotDesign/Wizard'
import { defaultRankingsAllowed } from 'src/vote/Ballot'
import { Item } from 'src/vote/Item'
import { MultiVoteItem } from 'src/vote/MultiVoteItem'
import { RankedChoiceItem } from 'src/vote/RankedChoiceItem'
import { ScoreItem } from 'src/vote/ScoreItem'
import { generateTrackingNum } from 'src/vote/tracking-num'
import { State as VoteState } from 'src/vote/vote-state'

import {
  BALLOT_METHODS,
  ballotDesignFor,
  BallotMethod,
  CANDIDATES,
  choiceFromPlaintext,
  DEMO_BALLOT_OPTIONS,
} from '../../content'
import { fakeCipher } from '../../shared/ciphertext'
import { formatMayor } from '../../shared/formatChoice'
import { LabeledRow } from '../../shared/LabeledRow'
import { PrimaryButton } from '../../shared/PrimaryButton'
import { BudgetBallot } from './BudgetBallot'

export function Vote({ onPick }: { onPick: (c: string) => void }) {
  const [method, setMethod] = useState<BallotMethod>('approval')
  const [plaintext, setPlaintext] = useState<Record<string, string>>({})
  const [showEncrypt, setShowEncrypt] = useState(false)
  // Preview # for the under-the-hood panel — real # is minted at submit
  const [previewVerification] = useState(() => generateTrackingNum())
  const design = useMemo(() => ballotDesignFor(method), [method])
  const state: VoteState = {
    ballot_design: [design],
    ballot_design_finalized: true,
    encoded: {},
    encrypted: {},
    plaintext,
    public_key: 'demo',
    randomizer: {},
  }
  const dispatch = (payload: Record<string, string>) => setPlaintext((prev) => ({ ...prev, ...payload }))
  const choice = choiceFromPlaintext(method, plaintext)
  const previewChoice = choice || CANDIDATES[0]

  return (
    <div>
      {/* Demo-only: production MultiVoteItem instruction is a bit tight in this shell */}
      <div className="[&_p.italic]:mb-2 [&_p.italic]:text-[0.95rem] [&_p.italic]:leading-relaxed [&_p.italic]:text-h26-textSecondary">
        {/* Same type routing as src/vote/Ballot.tsx */}
        {method === 'approval' && (
          <MultiVoteItem
            {...design}
            dispatch={dispatch}
            multiple_votes_allowed={DEMO_BALLOT_OPTIONS.length}
            options={DEMO_BALLOT_OPTIONS}
            state={state}
          />
        )}
        {method === 'multi' && (
          <MultiVoteItem
            {...design}
            dispatch={dispatch}
            multiple_votes_allowed={default_multiple_votes_allowed}
            options={DEMO_BALLOT_OPTIONS}
            state={state}
          />
        )}
        {method === 'plurality' && <Item {...design} dispatch={dispatch} options={DEMO_BALLOT_OPTIONS} state={state} />}
        {method === 'ranked' && (
          <RankedChoiceItem
            {...design}
            dispatch={dispatch}
            options={DEMO_BALLOT_OPTIONS}
            rankings_allowed={defaultRankingsAllowed}
            state={state}
          />
        )}
        {method === 'score' && (
          <ScoreItem {...design} dispatch={dispatch} options={DEMO_BALLOT_OPTIONS} state={state} />
        )}
        {method === 'budget' && <BudgetBallot design={design} dispatch={dispatch} state={state} />}
      </div>

      <PrimaryButton className="mt-2" disabled={!choice} onClick={() => choice && onPick(choice)}>
        Submit vote
      </PrimaryButton>

      <div className="mt-6 border-t border-black/[0.07] pt-5">
        <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">
          Try other voting methods · optional
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {BALLOT_METHODS.map((m) => (
            <button
              aria-pressed={method === m.id}
              className={`rounded-full border px-3 py-1.5 text-[0.72rem] transition-colors ${
                method === m.id
                  ? 'border-h26-green/40 bg-h26-green/[0.1] font-medium text-h26-green'
                  : 'border-black/10 text-h26-textSecondary hover:border-h26-green/30 hover:text-h26-text'
              }`}
              key={m.id}
              onClick={() => {
                setMethod(m.id)
                setPlaintext({})
              }}
              type="button"
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-black/[0.07] pt-5">
        <p className="font-mono26 text-[10px] uppercase tracking-[0.14em] text-h26-muted">
          Explore this step · optional
        </p>
        <button
          aria-expanded={showEncrypt}
          className={`mt-3 w-full rounded-xl border px-4 py-3 text-left transition-colors sm:max-w-sm ${
            showEncrypt
              ? 'border-h26-green/40 bg-h26-green/[0.06]'
              : 'border-black/10 hover:border-h26-green/30 hover:bg-h26-green/[0.03]'
          }`}
          onClick={() => setShowEncrypt((v) => !v)}
          type="button"
        >
          <span className="block text-[0.82rem] font-medium text-h26-text">On-device encryption</span>
          <span className="mt-1 block text-[0.72rem] text-h26-textSecondary">What happens when you submit</span>
        </button>

        {showEncrypt && (
          <div className="p-4 mt-3 space-y-3 rounded-xl bg-h26-bg">
            <p className="text-[0.8rem] leading-relaxed text-h26-textSecondary">
              Before anything leaves your device, it seals your choices and mints a secret Verification # — like locking
              a safe the election admin can accept without opening.
            </p>
            <LabeledRow
              label="Plaintext (on your device only)"
              value={`{ mayor: ${formatMayor(previewChoice)}, verification: '${previewVerification}' }`}
            />
            <LabeledRow emphasize label="Verification #" mono value={previewVerification} />
            <LabeledRow
              label="Ciphertext that will leave the device"
              mono
              value={fakeCipher(previewVerification + previewChoice)}
            />
            {!choice && (
              <p className="text-[0.72rem] text-h26-muted">Mark a choice above to preview with your selection.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
