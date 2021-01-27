import { Dispatch, SetStateAction } from 'react'

import { SaveButton } from './SaveButton'

export const ElectionTitleInput = ({
  set_stage,
  stage,
}: {
  set_stage: Dispatch<SetStateAction<number>>
  stage: number
}) => {
  return (
    <>
      <p>Election Title:</p>
      <input id="election-title" placeholder="Give your election a name your voters will recognize" />
      {stage === 0 && (
        <SaveButton
          onPress={async () => {
            await new Promise((res) => setTimeout(res, 1000))
            set_stage(stage + 1)
          }}
        />
      )}

      <style jsx>{`
        p {
          margin-bottom: 0px;
        }

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
