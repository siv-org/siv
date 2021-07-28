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
          <a className={selected === index ? 'selected' : ''} key={index} onClick={() => setSelected(index)}>
            {label}
          </a>
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
        a {
          border: 1px solid rgb(18, 18, 88);
          padding: 5px 10px;
          cursor: pointer;
        }
        a:not(:first-child) {
          border-left-width: 0px;
        }
        .selected {
          background-color: rgb(231, 226, 226);
        }
      `}</style>
    </>
  )
}
