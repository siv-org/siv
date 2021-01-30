import { CollapsibleSection } from '../CollapsibleSection'
import { useStored } from '../load-existing'
import { ManagerInput } from './ManagerInput'
import { StoredManager } from './StoredManager'
import { StoredTitle } from './StoredTitle'
import { TitleInput } from './TitleInput'

export const ElectionLabel = () => {
  const { election_manager, election_title } = useStored()

  return (
    <CollapsibleSection title="Election Label">
      <>
        <label>Election Title:</label>
        {!election_title ? (
          <TitleInput />
        ) : (
          <>
            <StoredTitle />

            <br />
            <label>Election Manager:</label>
            {!election_manager ? <ManagerInput /> : <StoredManager />}
          </>
        )}
      </>
    </CollapsibleSection>
  )
}
