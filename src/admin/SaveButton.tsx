import { useState } from 'react'

import { OnClickButton } from '../landing-page/Button'
import { Spinner } from './Spinner'

export const SaveButton = ({ id, onPress, text }: { id?: string; onPress: () => void; text?: string }) => {
  const [pending, set_pending] = useState(false)
  return (
    <>
      <div className="right-aligned">
        <OnClickButton
          id={id}
          style={{ marginRight: 0, padding: '8px 17px' }}
          onClick={async () => {
            set_pending(true)
            onPress()
          }}
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
