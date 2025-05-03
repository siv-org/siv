import { forwardRef, useState } from 'react'

import { OnClickButton } from '../_shared/Button'
import { Spinner } from './Spinner'

type SaveButtonProps = {
  disabled?: boolean
  id?: string
  onPress: () => Promise<void>
  text?: string
}

export const SaveButton = forwardRef<HTMLAnchorElement, SaveButtonProps>(
  ({ disabled, id, onPress, text }: SaveButtonProps, ref) => {
    const [pending, set_pending] = useState(false)
    return (
      <>
        <div className="text-right">
          <OnClickButton
            id={id}
            onClick={async () => {
              set_pending(true)
              await onPress()
              set_pending(false)
            }}
            ref={ref}
            style={{ marginRight: 0, padding: '8px 17px' }}
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
      </>
    )
  },
)
SaveButton.displayName = 'SaveButton'
