import { StageAndSetter } from './AdminPage'
import { SaveButton } from './SaveButton'

export const ElectionTitleInput = ({ set_stage, stage }: StageAndSetter) => {
  return (
    <>
      <h3>Election Title:</h3>
      <input
        id="election-title"
        placeholder="Give your election a name your voters will recognize"
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            document.getElementById('election-title')?.blur()
            document.getElementById('election-title-save')?.click()
          }
        }}
      />
      {stage === 0 && (
        <SaveButton
          id="election-title-save"
          onPress={async () => {
            await new Promise((res) => setTimeout(res, 1000))
            set_stage(stage + 1)
          }}
        />
      )}

      <style jsx>{`
        input {
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          padding: 8px;
          width: 100%;
        }
      `}</style>
    </>
  )
}
