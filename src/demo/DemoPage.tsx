import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { BlueDivider } from '../landing-page/BlueDivider'
import { Footer } from '../landing-page/Footer'
import { HeaderBar } from './HeaderBar'

export const DemoPage = (): JSX.Element => {
  return (
    <>
      <Head title="SIV Demo" />

      <HeaderBar />
      <main>
        <h2>Election Demo</h2>

        <div className="container">
          <iframe
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="video"
            frameBorder="0"
            src="https://www.youtube-nocookie.com/embed/PzUU_rcLurQ"
            title="SIV Demo video"
          ></iframe>
        </div>
      </main>
      <BlueDivider />
      <Footer />
      <style jsx>{`
        main {
          max-width: 1050px;
          width: 100%;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .container {
          position: relative;
          width: 100%;
          height: 0;
          padding-bottom: 56.25%;
        }
        .video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
      <GlobalCSS />
    </>
  )
}
