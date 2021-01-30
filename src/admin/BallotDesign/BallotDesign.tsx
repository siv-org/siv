import { CollapsibleSection } from '../CollapsibleSection'
import { use_stored_info } from '../load-existing'
import { DesignInput } from './DesignInput'
import { StoredDesign } from './StoredDesign'

export const BallotDesign = () => {
  const { ballot_design } = use_stored_info()
  return (
    <CollapsibleSection title="Ballot Design">{!ballot_design ? <DesignInput /> : <StoredDesign />}</CollapsibleSection>
  )
}
