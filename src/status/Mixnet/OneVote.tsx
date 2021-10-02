import { FileOutlined } from '@ant-design/icons'
import { CSSProperties } from 'react'

export const OneVote = ({ step = 0, style }: { step?: number; style: CSSProperties }) => {
  return (
    <div {...{ style }}>
      <FileOutlined style={{ fontSize: 48 }} />
      {step === 0 && <img src="/vote/lock.png" />}
      {step === 1 && <img className="unlocked" src="/vote/unlocked.png" />}
      {step > 1 && <p>...</p>}
      <style jsx>{`
        div {
          position: relative;
          padding-left: 0px;
        }

        img {
          width: 13px;
          position: absolute;
          left: 16px;
          top: 18px;
        }

        .unlocked {
          width: 17px;
          left: 14px;
        }

        p {
          position: absolute;
          top: 14px;
          left: 16px;
          margin: 0;
          font-size: 14px;
          font-weight: 800;
        }
      `}</style>
    </div>
  )
}
