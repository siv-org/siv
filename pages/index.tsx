import CssBaseline from '@material-ui/core/CssBaseline'
import Head from 'next/head'

import CallToAction from '../src/call-to-action'
import Intro from '../src/intro.mdx'
import Protocol from '../src/protocol'
import ViewCounter from '../src/view-counter'

export const Home = (): JSX.Element => (
  <div className="container">
    <Head>
      <title>SIV: Secure Internet Voting</title>
      <link href="/favicon.ico" rel="icon" />
      <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
    </Head>
    <CssBaseline />

    <main>
      <h1>SIV: Secure Internet Voting</h1>

      <h2>Fast — Private — Verifiable</h2>

      <ViewCounter />

      <Intro />

      <CallToAction />

      <Protocol />
    </main>
  </div>
)

export default Home
