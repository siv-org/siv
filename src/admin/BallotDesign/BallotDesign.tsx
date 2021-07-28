import router from 'next/router'
import { useState } from 'react'

import { api } from '../../api-helper'
import { SaveButton } from '../SaveButton'
import { revalidate, useStored } from '../useStored'
import { check_for_ballot_errors } from './check_for_ballot_errors'
import { default_ballot_design } from './default-ballot-design'
import { ModeControls } from './ModeControls'
import { PointAndClick } from './PointAndClick'
import { TextDesigner } from './TextDesigner'

export const BallotDesign = () => {
  const { ballot_design: stored_ballot_design, election_id } = useStored()
  const [selected, setSelected] = useState(1)
  const [design, setDesign] = useState(stored_ballot_design || default_ballot_design)

  return (
    <>
      <h2>Ballot Design</h2>
      <ModeControls {...{ selected, setSelected }} />
      <div className="mode-container">
        {selected !== 1 && <PointAndClick {...{ design, setDesign }} />}
        {selected === 2 && <div className="spacer" />}
        {selected !== 0 && <TextDesigner {...{ design, setDesign }} />}
      </div>

      {!stored_ballot_design && (
        <SaveButton
          disabled={!!check_for_ballot_errors(design)}
          onPress={async () => {
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
