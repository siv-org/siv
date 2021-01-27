import { StageAndSetter } from '../AdminPage'
import { StoredTitle } from './StoredTitle'
import { TitleInput } from './TitleInput'

export const ElectionTitle = ({ set_stage, stage }: StageAndSetter) => {
  return (
    <>
      <h3>Election Title:</h3>
      {stage === 0 ? <TitleInput {...{ set_stage, stage }} /> : <StoredTitle />}

      <style jsx>{``}</style>
    </>
  )
}
