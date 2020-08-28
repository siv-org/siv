import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AddParticipants } from './AddParticipants'
import { BallotDesigner } from './BallotDesigner'
import { HeaderBar } from './HeaderBar'

export const CreatePage = (): JSX.Element => {
  return (
    <>
      <Head title="Create new election" />

      <HeaderBar />
      <main>
        <h1>Create a New Election</h1>
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
      <GlobalCSS />
    </>
  )
}
