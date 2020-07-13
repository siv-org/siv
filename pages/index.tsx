import Head from 'next/head'

import CallToAction from '../src/call-to-action'
import CollapsibleIntro from '../src/collapsible-intro'
import PageviewCounter from '../src/pageview-counter'
import Protocol from '../src/protocol'

export const Home = (): JSX.Element => (
  <div className="container">
    <Head>
      <title>SIV: Secure Internet Voting</title>
      <link href="/favicon.ico" rel="icon" />
      <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
    </Head>

    <main>
      <h1>SIV: Secure Internet Voting</h1>

      <h2>Fast — Private — Verifiable</h2>

      <PageviewCounter />

      <CollapsibleIntro />

      <CallToAction />

      <Protocol />
    </main>
  </div>
)

export default Home
