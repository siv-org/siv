import { StageAndSetter } from '../AdminPage'
import { CollapsibleSection } from '../CollapsibleSection'
import { StoredTitle } from './StoredTitle'
import { TitleInput } from './TitleInput'

export const ElectionTitle = ({ set_stage, stage }: StageAndSetter) => {
  return (
    <CollapsibleSection title="Election Title">
      {stage === 0 ? <TitleInput {...{ set_stage, stage }} /> : <StoredTitle />}
    </CollapsibleSection>
  )
}
