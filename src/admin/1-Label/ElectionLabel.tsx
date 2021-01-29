import { StageAndSetter } from '../AdminPage'
import { CollapsibleSection } from '../CollapsibleSection'
import { ManagerInput } from './ManagerInput'
import { StoredManager } from './StoredManager'
import { StoredTitle } from './StoredTitle'
import { TitleInput } from './TitleInput'

export const ElectionLabel = ({ stage }: StageAndSetter) => {
  return (
    <CollapsibleSection title="Election Label">
      <>
        <label>Election Title:</label>
        {stage === 0 ? <TitleInput /> : <StoredTitle />}

        <br />
        <label>Election Manager:</label>
        {stage === 0.5 && <ManagerInput />}
        {stage > 0.5 && <StoredManager />}
      </>
    </CollapsibleSection>
  )
}
