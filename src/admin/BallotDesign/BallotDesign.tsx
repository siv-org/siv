import { NoSsr } from '@material-ui/core'
import router from 'next/router'
import { useEffect, useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'
import { check_for_less_urgent_ballot_errors, check_for_urgent_ballot_errors } from './check_for_ballot_errors'
import { default_ballot_design } from './default-ballot-design'
import { Errors } from './Errors'
import { ModeControls } from './ModeControls'
import { TextDesigner } from './TextDesigner'
import { Wizard } from './Wizard'

export const BallotDesign = () => {
  const { ballot_design: stored_ballot_design, election_id } = useStored()
  const [selected, setSelected] = useState(2)
  const [design, setDesign] = useState(stored_ballot_design || default_ballot_design)
  const [saving_errors, set_saving_errors] = useState<null | string>(null)

  const error = check_for_urgent_ballot_errors(design) || saving_errors

  // Reset saving errors whenever design changes
  useEffect(() => {
    set_saving_errors(null)
  }, [design])

  return (
    <>
      <h2>Ballot Design</h2>
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

      {!stored_ballot_design && (
        <SaveButton
          disabled={!!error}
          text={error ? 'Error!' : 'Finalize'}
          onPress={async () => {
            const error = check_for_less_urgent_ballot_errors(design)
            if (error) return set_saving_errors(error)

            const response = await api(`election/${election_id}/admin/save-ballot-design`, { ballot_design: design })

            if (response.status !== 201) return alert(JSON.stringify(await response.json()))

            revalidate(election_id)
            router.push(`${window.location.origin}/admin/${election_id}/voters`)
          }}
        />
      )}

      <style jsx>{`
        /* When sidebar disappears */
        @media (max-width: 500px) {
          h2 {
            opacity: 0;
            margin: 0px;
          }
        }

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
