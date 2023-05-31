import { LoadingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

export const Spinner = ({ countSeconds }: { countSeconds?: boolean }) => {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!countSeconds) return

    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <span style={{ position: 'relative' }}>
      <LoadingOutlined /> &nbsp;
      {countSeconds && (
        <i
          style={{
            fontSize: 9,
            fontWeight: 200,
            left: seconds < 10 ? 4 : seconds < 100 ? 1.5 : -0.5,
            opacity: 0.6,
            position: 'absolute',
            textAlign: 'center',
            top: 3,
          }}
        >
          {seconds}
        </i>
      )}
    </span>
  )
}
