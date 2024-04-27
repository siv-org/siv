import type { State } from './vote-state'

export const BallotPreview = ({ state }: { state: State }) => {
  if (!state.ballot_design) return null // Still loading
  if (state.ballot_design_finalized && state.public_key) return null // Ready

  return (
    <div className="text-center">
      <div className="inline-block p-2 px-4 text-[17px] text-red-900 bg-gray-200 rounded-lg">
        <div className="mr-3 text-red-700 opacity-80">
          <span className="text-[14px] relative bottom-px">⚠️</span> Not ready for voting
        </div>

        {!state.ballot_design_finalized && <div>1. Ballot design not finalized</div>}

        {!state.public_key && <div>{state.ballot_design_finalized ? 1 : 2}. Elections Observers not finalized</div>}
      </div>
    </div>
  )
}
