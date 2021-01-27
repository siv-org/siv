import { useState } from 'react'

import { checkPassword } from '../create/AddGroup'
import { OnClickButton } from '../landing-page/Button'
import { Spinner } from './Spinner'

export const SaveButton = ({ onPress }: { onPress: () => void }) => {
  const [pending, set_pending] = useState(false)
  return (
    <>
      <div className="right-aligned">
        <OnClickButton
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
