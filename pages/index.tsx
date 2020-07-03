import Head from 'next/head'

import Intro from '../src/intro.mdx'
import Protocol from '../src/protocol'
import ViewCounter from '../src/view-counter'

export const Home = (): JSX.Element => (
  <div className="container">
    <Head>
      <title>SIV: Secure Internet Voting</title>
      <link href="/favicon.ico" rel="icon" />
    </Head>

    <main>
      <h1>SIV: Secure Internet Voting</h1>

      <h2>Fast — Private — Verifiable</h2>

      <ViewCounter />

      <Intro />

      <br />

      <Protocol />
    </main>
  </div>
)

export default Home
