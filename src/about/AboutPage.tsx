import { HeaderBar } from '../faq/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { BlueDivider } from '../landing-page/BlueDivider'
import { Footer } from '../landing-page/Footer'
import { BuiltUponResearch } from './BuiltUponResearch'
import { Endorsements } from './Endorsements'
import { Team } from './Team'

export const AboutPage = (): JSX.Element => (
  <>
    <Head title="About" />

    <HeaderBar />
    <main>
      <h1>About</h1>
      <BuiltUponResearch />
      <Team />
      <Endorsements />
    </main>
    <BlueDivider />
    <Footer />

    <style jsx>{`
      main {
        max-width: 750px;
        width: 100%;
        margin: 2rem auto;
        padding: 1rem;
      }

      div {
        margin-bottom: 3rem;
      }

      p {
        white-space: pre-wrap;
      }
    `}</style>
    <GlobalCSS />
  </>
)
