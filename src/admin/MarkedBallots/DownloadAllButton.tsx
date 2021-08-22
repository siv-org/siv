import { DownloadOutlined } from '@ant-design/icons'
import { useEffect, useRef } from 'react'
import { darkBlue } from 'src/landing-page/Button'

export const DownloadAllButton = () => {
  const button = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!button || !button.current) return
    const sample_url = `${window?.location?.origin}/sample-ballot.pdf`
    button.current.href = sample_url
  }, [])

  const invertColor = false

  return (
    <a download="sample" ref={button}>
      <DownloadOutlined style={{ fontSize: 20, marginRight: 7 }} />
      Download All
      <style jsx>{`
        a {
          background: none;
          border: 2px solid ${invertColor ? '#fff' : darkBlue};
          border-radius: 0.4rem;
          color: ${invertColor ? '#fff' : darkBlue};
          display: inline-block;
          font-weight: bold;
          margin: 17px;
          padding: 1.2rem 2.004rem;
          text-decoration: none;
          transition: 0.1s background-color linear, 0.1s color linear;

          margin-left: 0;
          padding: 6px 15px;
        }

        a:hover {
          background-color: ${invertColor ? '#fff' : darkBlue};
          color: ${invertColor ? '#000' : '#fff'};
        }
      `}</style>
    </a>
  )
}
