import { useEffect, useState } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'

import { useStored } from '../useStored'
import { AutoSaver } from './AutoSaver'
import { BallotDesignFinalizedBanner } from './BallotDesignFinalizedBanner'
import { check_for_fatal_ballot_errors } from './check_for_ballot_errors'
import { default_ballot_design } from './default-ballot-design'
import { Errors } from './Errors'
import { FinalizeBallotDesignButton } from './FinalizeBallotDesignButton'
import { JsonEditor } from './JsonEditor'
import { ModeControls } from './ModeControls'
import { TipToRunPracticeVote } from './TipToRunPracticeVote'
import { Wizard } from './Wizard'

export const BallotDesign = () => {
  const { ballot_design: stored_ballot_design, ballot_design_finalized, election_id } = useStored()
  const [selected, setSelected] = useState(0)

  const [design, setDesign] = useState(stored_ballot_design || default_ballot_design)
  const setDesignIfNotFinalized = !ballot_design_finalized ? setDesign : () => alert('Ballot design already finalized')

  const [saving_errors, set_saving_errors] = useState<null | string>(null)

  const error = check_for_fatal_ballot_errors(design) || saving_errors

  // Reset saving errors whenever design changes
  useEffect(() => {
    set_saving_errors(null)
  }, [design])

  // Restore stored ballot design on hard refresh
  useEffect(() => {
    if (stored_ballot_design) setDesign(stored_ballot_design)
  }, [stored_ballot_design])

  return (
    <>
      <TipToRunPracticeVote />

      <h2 className="hidden sm:block">
        Ballot Design
        <span className="ml-3">
          <PreviewButton election_id={election_id} />
        </span>
      </h2>

      {ballot_design_finalized ? <BallotDesignFinalizedBanner /> : <AutoSaver {...{ design }} />}

      <div className="mt-3 sm:hidden">
        <PreviewButton election_id={election_id} />
      </div>

      <Errors {...{ error }} />

      <ModeControls {...{ selected, setSelected }} />
      <div className="relative flex w-full top-[3px]">
        {selected !== 1 && <Wizard {...{ design, setDesign: setDesignIfNotFinalized }} />}
        {selected === 2 && <div className="w-5" /> /* spacer */}
        {selected !== 0 && (
          <NoSsr>
            <JsonEditor {...{ design, setDesign: setDesignIfNotFinalized }} />
          </NoSsr>
        )}
      </div>

      {!ballot_design_finalized && (
        <FinalizeBallotDesignButton {...{ design, election_id, error, set_saving_errors }} />
      )}
    </>
  )
}

function PreviewButton({ election_id }: { election_id?: string }) {
  return (
    <a
      className="inline-block text-[12px] font-semibold !no-underline hover:bg-gray-100 px-3 py-1 border border-blue-900 border-solid rounded-lg relative bottom-0.5 text-blue-900"
      href={`/election/${election_id}/vote?auth=preview`}
      rel="noreferrer"
      target="_blank"
    >
      🔍 Preview
    </a>
  )
}
