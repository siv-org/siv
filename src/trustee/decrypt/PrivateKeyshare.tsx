import { useState } from 'react'

import { PrivateBox } from '../PrivateBox'

export const PrivateKeyshare = ({ private_keyshare }: { private_keyshare: string }) => {
  const [blurred, setBlurred] = useState(true)

  return (
    <div className="mt-8">
      <PrivateBox>
        <p>
          Your Private keyshare is:{' '}
          <span className={`font-mono cursor-pointer ${blurred && 'blur-sm'}`} onClick={() => setBlurred(!blurred)}>
            {!blurred ? private_keyshare : blurredTextMask(private_keyshare.length)}
          </span>
        </p>
      </PrivateBox>
    </div>
  )
}

function blurredTextMask(length: number) {
  let newString = ''
  const blurred_text = 'BLURRED&TEXTREPLACEDBECAUSEJUSTBLURRINGALONECANBEUNDONEPRETTYEASILYACTUALLY.'
  for (let i = 0; i < length; i += blurred_text.length) {
    newString += blurred_text
  }
  return newString.slice(0, length)
}
