import { HeaderBar } from '../faq/HeaderBar'
import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { AboveFold } from '../landing-page/AboveFold'
import { BlueDivider } from '../landing-page/BlueDivider'
import { Footer } from '../landing-page/Footer'
import { BuiltUponResearch } from './BuiltUponResearch'
import { Team } from './Team'

export const AboutPage = (): JSX.Element => (
  <>
    <Head title="About" />

    <HeaderBar />
    <AboveFold />
    <main>
      <BuiltUponResearch />
      <Team />
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
