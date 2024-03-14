import router from 'next/router'
import { useEffect, useState } from 'react'
import { NoSsr } from 'src/_shared/NoSsr'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'
import { AutoSaver } from './AutoSaver'
import { check_for_less_urgent_ballot_errors, check_for_urgent_ballot_errors } from './check_for_ballot_errors'
import { default_ballot_design } from './default-ballot-design'
import { Errors } from './Errors'
import { ModeControls } from './ModeControls'
import { TextDesigner } from './TextDesigner'
import { Wizard } from './Wizard'

export const BallotDesign = () => {
  const { ballot_design: stored_ballot_design, ballot_design_finalized, election_id, election_title } = useStored()
  const [selected, setSelected] = useState(0)

  const designState = useState(stored_ballot_design || default_ballot_design)
  const [design] = designState
  const setDesign = !ballot_design_finalized ? designState[1] : () => {}

  const [saving_errors, set_saving_errors] = useState<null | string>(null)

  const error = check_for_urgent_ballot_errors(design) || saving_errors

  // Reset saving errors whenever design changes
  useEffect(() => {
    set_saving_errors(null)
  }, [design])

  // Restore stored ballot design on hard refresh
  useEffect(() => {
    if (!election_title) return
    if (!stored_ballot_design) return
    setDesign(stored_ballot_design)
  }, [election_title])

  return (
    <>
      <h2 className="hidden sm:block">Ballot Design</h2>
      <AutoSaver {...{ design }} />
      <Errors {...{ error }} />
      <ModeControls {...{ selected, setSelected }} />
      <div className="mode-container">
        {selected !== 1 && <Wizard {...{ design, setDesign }} />}
        {selected === 2 && <div className="spacer" />}
        {selected !== 0 && (
          <NoSsr>
            <TextDesigner {...{ design, setDesign }} />
          </NoSsr>
        )}
      </div>

      {!ballot_design_finalized && (
        <SaveButton
          disabled={!!error}
          text={error ? 'Error!' : 'Finalize'}
          onPress={async () => {
            const error = check_for_less_urgent_ballot_errors(design)
            if (error) return set_saving_errors(error)

            const response = await api(`election/${election_id}/admin/finalize-ballot-design`)
            if (response.status !== 201) return alert(JSON.stringify(await response.json()))

            revalidate(election_id)
            router.push(`${window.location.origin}/admin/${election_id}/observers`)
          }}
        />
      )}

      <style jsx>{`
        .mode-container {
          display: flex;
          width: 100%;
          position: relative;
          top: 3px;
        }

        .spacer {
          width: 20px;
        }
      `}</style>
    </>
  )
}
