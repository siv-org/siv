import Head from 'next/head'

import { Content } from './Content'
import { ScrollContextProvider } from './ScrollContext'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { VoteContextProvider } from './VoteContext'

export const ProtocolPage = (): JSX.Element => (
  <>
    <Head>
      <title>SIV: Protocol</title>
      <link href="/favicon.png" rel="icon" />

      <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
    </Head>

    <VoteContextProvider>
      <ScrollContextProvider>
        <Topbar />
        <div className="columns">
          <Sidebar />
          <Content />
        </div>
      </ScrollContextProvider>
    </VoteContextProvider>

    <style jsx>{`
      .columns {
        display: flex;
      }
    `}</style>

    <style global jsx>{`
      body {
        color: #222;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
          Droid Sans, Helvetica Neue, sans-serif;
        font-size: 0.875rem;
        letter-spacing: 0.01071em;
        line-height: 1.43;

        max-width: 100%;
        overflow: hidden;
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
