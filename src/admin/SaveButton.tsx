import { useState } from 'react'

import { OnClickButton } from '../_shared/Button'
import { Spinner } from './Spinner'

export const SaveButton = ({
  disabled,
  id,
  onPress,
  text,
}: {
  disabled?: boolean
  id?: string
  onPress: () => Promise<void>
  text?: string
}) => {
  const [pending, set_pending] = useState(false)
  return (
    <>
      <div className="right-aligned">
        <OnClickButton
          id={id}
          style={{ marginRight: 0, padding: '8px 17px' }}
          onClick={async () => {
            set_pending(true)
            await onPress()
            set_pending(false)
          }}
          {...{ disabled }}
        >
          {!pending ? (
            text || 'Save'
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
