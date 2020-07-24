import Head from 'next/head'

import Protocol from '../src/protocol'

const ProtocolPage = (): JSX.Element => (
  <>
    <Head>
      <title>SIV: Protocol</title>
      <link href="/favicon.png" rel="icon" />
      <link href="/protocol.css" rel="stylesheet" />

      <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
    </Head>

    <main>
      <Protocol />
    </main>
  </>
)

export default ProtocolPage
