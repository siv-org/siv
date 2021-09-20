import { ReloadOutlined } from '@ant-design/icons'
import { OnClickButton } from 'src/landing-page/Button'

export const ReplayButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <>
      <OnClickButton style={{ margin: 0, marginBottom: 30, padding: '5px 15px' }} {...{ onClick }}>
        <>
          <ReloadOutlined /> Replay Animation
        </>
      </OnClickButton>
    </>
  )
}
