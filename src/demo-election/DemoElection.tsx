import Head from 'next/head'

import { Question } from './Question'

export const DemoElection = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>SIV: Demo Election</title>
        <link href="/favicon.png" rel="icon" />
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
        <meta content="/preview.png" property="og:image" />
      </Head>

      <main>
        <h1>SIV Demo Election</h1>
        <Question />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 2rem auto;
          padding: 1rem;
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
}
