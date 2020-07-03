import { DownloadOutlined } from '@ant-design/icons'

export default function Protocol(): JSX.Element {
  return (
    <>
      <hr style={{ width: '100%' }} />
      <a href="./Overview.png" target="_blank" style={{ margin: '2rem 0 3rem' }}>
        <DownloadOutlined />
        &nbsp;Download single image
      </a>
      {[
        'header',
        'pre-a-voter-registration',
        'pre-b-shufflers-registered',
        'pre-c-ballot-finalized',
        'step-1',
        'step-2a',
        'step-2b',
        'step-2c',
        'step-2d',
        'step-2e',
        'step-2f',
        'step-2g',
        'step-2h',
        'step-3',
        'step-4',
        'step-5',
        'step-6',
        'step-fin',
      ].map((filename) => (
        <div key={filename} style={{ backgroundColor: '#e5eafd', paddingBottom: '2rem' }}>
          <img src={`./overview/${filename}.png`} width="100%" />
        </div>
      ))}
    </>
  )
}
