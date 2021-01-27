import { StageAndSetter } from '../AdminPage'
import { DesignInput } from './DesignInput'
import { StoredDesign } from './StoredDesign'

export const BallotDesign = ({ set_stage, stage }: StageAndSetter) => {
  return (
    <>
      <h3>Ballot Design:</h3>

      {stage === 2 ? <DesignInput {...{ set_stage, stage }} /> : <StoredDesign />}

      <style jsx>{``}</style>
    </>
  )
}
