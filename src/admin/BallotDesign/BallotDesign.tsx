import { CollapsibleSection } from '../CollapsibleSection'
import { useStored } from '../load-existing'
import { DesignInput } from './DesignInput'
import { StoredDesign } from './StoredDesign'

export const BallotDesign = () => {
  const { ballot_design } = useStored()
  return (
    <CollapsibleSection title="Ballot Design">{!ballot_design ? <DesignInput /> : <StoredDesign />}</CollapsibleSection>
  )
}
