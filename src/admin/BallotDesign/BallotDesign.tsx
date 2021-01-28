import { StageAndSetter } from '../AdminPage'
import { CollapsibleSection } from '../CollapsibleSection'
import { DesignInput } from './DesignInput'
import { StoredDesign } from './StoredDesign'

export const BallotDesign = ({ set_stage, stage }: StageAndSetter) => {
  return (
    <CollapsibleSection title="Ballot Design">
      {stage === 2 ? <DesignInput {...{ set_stage, stage }} /> : <StoredDesign />}
    </CollapsibleSection>
  )
}
