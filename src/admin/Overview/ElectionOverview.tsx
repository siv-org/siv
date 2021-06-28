import { useStored } from '../useStored'
import { ManagerInput } from './ManagerInput'
import { StoredManager } from './StoredManager'
import { StoredTitle } from './StoredTitle'
import { TitleInput } from './TitleInput'

export const ElectionOverview = () => {
  const { election_manager, election_title } = useStored()

  return (
    <>
      <h2>Election Overview</h2>
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
  )
}
