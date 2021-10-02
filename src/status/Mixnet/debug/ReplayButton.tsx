import { ReloadOutlined } from '@ant-design/icons'
import { OnClickButton } from 'src/landing-page/Button'

import { debug } from '../Mixnet'

export const ReplayButton = ({ maxStep, onClick, step }: { maxStep: number; onClick: () => void; step: number }) => {
  if (!debug) return null

  return (
    <>
      <OnClickButton style={{ margin: 0, marginRight: 10, padding: '5px 15px' }} {...{ onClick }}>
        <>
          <ReloadOutlined style={{ marginRight: 5 }} /> Replay?
        </>
      </OnClickButton>
      Step {step} of {maxStep}
    </>
  )
}
