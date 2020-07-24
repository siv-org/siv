import Head from 'next/head'

import Protocol from '../src/protocol'

const ProtocolPage = (): JSX.Element => (
  <>
    <Head>
      <title>SIV: Protocol</title>
      <link href="/favicon.png" rel="icon" />
      <link href="/onepager.css" rel="stylesheet" />

      <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
    </Head>

    <div className="container">
      <main>
        <Protocol />
      </main>
    </div>
  </>
)

export default ProtocolPage
