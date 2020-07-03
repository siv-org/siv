import { DownloadOutlined } from '@ant-design/icons'

export default function Protocol(): JSX.Element {
  return (
    <>
      <hr style={{ width: '100%' }} />
      <a href="./Overview.png" target="_blank" style={{ margin: '2rem 0 3rem' }}>
        <DownloadOutlined />
        &nbsp;Download single image
      </a>
      <img src="./Overview.png" width="100%" />
    </>
  )
}
