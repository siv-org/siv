import { Head } from '../Head'
import { AddParticipants } from './AddParticipants'
import { BallotDesigner } from './BallotDesigner'

export const CreatePage = (): JSX.Element => {
  return (
    <>
      <Head title="Create new election" />

      <main>
        <h1>Secure Internet Voting: Create new election</h1>
        <BallotDesigner />
        <AddParticipants />
      </main>

      <style jsx>{`
        main {
          max-width: 750px;
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        h1 {
          margin-top: 0;
          font-size: 22px;
        }

        h2 {
          font-size: 18px;
        }
      `}</style>

      <style global jsx>{`
        body {
          background-color: hsl(0, 0%, 97%);
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
      `}</style>
    </>
  )
}
