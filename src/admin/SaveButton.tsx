import { useState } from 'react'

import { OnClickButton } from '../landing-page/Button'
import { checkPassword } from './checkPassword'
import { Spinner } from './Spinner'

export const SaveButton = ({ id, onPress }: { id?: string; onPress: () => void }) => {
  const [pending, set_pending] = useState(false)
  return (
    <>
      <div className="right-aligned">
        <OnClickButton
          id={id}
          style={{ marginRight: 0, padding: '8px 17px' }}
          onClick={async () => {
            if (!checkPassword()) return

            set_pending(true)
            await onPress()
          }}
        >
          {!pending ? (
            ' Save'
          ) : (
            <>
              <Spinner /> Saving...
            </>
          )}
        </OnClickButton>
      </div>

      <style jsx>{`
        .right-aligned {
          text-align: right;
        }
      `}</style>
    </>
  )
}
