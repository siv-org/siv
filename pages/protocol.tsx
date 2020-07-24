import Head from 'next/head'

import Protocol from '../src/protocol'

const ProtocolPage = (): JSX.Element => (
  <>
    <Head>
      <title>SIV: Protocol</title>
      <link href="/favicon.png" rel="icon" />

      <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
    </Head>

    <div className="center-horizontal">
      <main>
        <Protocol />
      </main>
    </div>

    <style global jsx>{`
      body {
        background-color: #fcfcfc;
        color: #222;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
          Droid Sans, Helvetica Neue, sans-serif;
        font-size: 0.875rem;
        letter-spacing: 0.01071em;
        line-height: 1.43;
      }

      .center-horizontal {
        display: flex;
        justify-content: center;
      }

      main {
        display: flex;
        max-width: 600px;
        min-height: 100vh;
        flex-direction: column;
        justify-content: center;
      }

      a {
        color: #0070f3;
        text-decoration: none;
      }

      a:hover,
      a:focus,
      a:active {
        text-decoration: underline;
      }
    `}</style>
  </>
)

export default ProtocolPage
