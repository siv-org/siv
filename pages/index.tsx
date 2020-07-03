import Head from 'next/head'

import Intro from '../src/intro.mdx'
import ViewCounter from '../src/view-counter'

export const Home = (): JSX.Element => (
  <div className="container">
    <Head>
      <title>SIV: Secure Internet Voting</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <h1>SIV: Secure Internet Voting</h1>

      <h2>Fast — Private — Verifiable</h2>

      <ViewCounter />

      <Intro />

      <br />

      <a href="./Overview.png" target="_blank">
        <img src="./Overview.png" width="100%" />
      </a>
    </main>
  </div>
)

export default Home
