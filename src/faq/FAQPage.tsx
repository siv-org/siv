import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { BlueDivider } from '../landing-page/BlueDivider'
import { Footer } from '../landing-page/Footer'
import { faq } from './faq'
import { HeaderBar } from './HeaderBar'

export const FAQPage = (): JSX.Element => (
  <>
    <Head title="FAQ" />

    <HeaderBar />
    <main>
      <h1>Frequently Asked Questions</h1>
      {faq.map(({ q, resp }, index) => (
        <div key={index}>
          <h3>{q}</h3>
          <p>{resp}</p>
        </div>
      ))}
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
