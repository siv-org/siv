import { useState } from 'react'

import { ModeControls } from './ModeControls'
import { PointAndClick } from './PointAndClick'
import { TextDesigner } from './TextDesigner'

export const BallotDesign = () => {
  const [selected, setSelected] = useState(1)
  return (
    <>
      <h2>Ballot Design</h2>
      <ModeControls {...{ selected, setSelected }} />
      <div className="mode-container">
        {selected !== 1 && <PointAndClick />}
        {selected !== 0 && <TextDesigner />}
      </div>
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
        }
      `}</style>
    </>
  )
}
