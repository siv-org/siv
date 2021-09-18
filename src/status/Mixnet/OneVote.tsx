import { FileOutlined } from '@ant-design/icons'
import { CSSProperties } from 'react'

export const OneVote = ({ style }: { style: CSSProperties }) => {
  return (
    <div {...{ style }}>
      <FileOutlined style={{ fontSize: 48 }} />
      <img src="/vote/lock.png" />
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
      `}</style>
    </div>
  )
}
