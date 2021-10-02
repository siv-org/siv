import { ReloadOutlined } from '@ant-design/icons'
import { OnClickButton } from 'src/landing-page/Button'

import { debug } from '../Mixnet'

export const ReplayButton = ({ onClick }: { onClick: () => void }) => {
  if (!debug) return null

  return (
    <>
      <OnClickButton style={{ margin: 0, padding: '5px 15px' }} {...{ onClick }}>
        <>
          <ReloadOutlined /> Replay Animation
        </>
      </OnClickButton>
    </>
  )
}
