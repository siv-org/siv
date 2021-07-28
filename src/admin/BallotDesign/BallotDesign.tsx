import { useState } from 'react'

import { useStored } from '../useStored'
import { DesignInput } from './DesignInput'
import { StoredDesign } from './StoredDesign'

export const BallotDesign = () => {
  const { ballot_design } = useStored()
  const [selected, setSelected] = useState(1)
  return (
    <>
      <h2>Ballot Design</h2>
      <div>
        {['Point & Click', 'Text', 'Split'].map((label, index) => (
          <span className={selected === index ? 'selected' : ''} key={index} onClick={() => setSelected(index)}>
            {label}
          </span>
        ))}
      </div>
      {!ballot_design ? <DesignInput /> : <StoredDesign />}
      <style jsx>{`
        /* When sidebar disappears */
        @media (max-width: 500px) {
          h2 {
            opacity: 0;
            margin: 0px;
          }
        }
        div {
          float: right;
        }
        span {
          border: 1px solid hsl(0, 0%, 76%);
          padding: 5px 15px;
          cursor: pointer;
          user-select: none;
        }
        span:hover {
          background-color: hsl(0, 0%, 97%);
        }
        span:active {
          background-color: hsl(0, 0%, 84%) !important;
          border-top-color: hsl(0, 0%, 70%);
        }
        span:not(:first-child) {
          border-left-width: 0px;
        }
        span.selected {
          background-color: hsl(0, 0%, 95%);
        }
      `}</style>
    </>
  )
}
