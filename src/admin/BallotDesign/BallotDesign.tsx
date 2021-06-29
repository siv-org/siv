import { useStored } from '../useStored'
import { DesignInput } from './DesignInput'
import { StoredDesign } from './StoredDesign'

export const BallotDesign = () => {
  const { ballot_design } = useStored()
  return (
    <>
      <h2>Ballot Design</h2>
      {!ballot_design ? <DesignInput /> : <StoredDesign />}
      <style jsx>{`
        /* When sidebar disappears */
        @media (max-width: 500px) {
          h2 {
            opacity: 0;
            margin: 0px;
          }
        }
      `}</style>
    </>
  )
}
