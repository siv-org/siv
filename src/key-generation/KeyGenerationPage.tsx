import { HeaderBar } from '../create/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Attendees } from './Attendees'

export const KeyGenerationPage = (): JSX.Element => {
  return (
    <>
      <Head title="Key Generation" />

      <HeaderBar />
      <main>
        <h1>Threshold Key Generation</h1>
        <Attendees />
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
