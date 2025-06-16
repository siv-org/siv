import { GlobalCSS } from '../GlobalCSS'
import { Head } from '../Head'
import { Footer } from '../homepage/Footer'
import { HeaderBar } from '../homepage/HeaderBar'
import { useAnalytics } from '../useAnalytics'

export const DemoPage = (): JSX.Element => {
  useAnalytics()
  return (
    <>
      <Head title="SIV Demo" />

      <div className="page">
        <HeaderBar />
        <main>
          <div className="video-container">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video"
              frameBorder="0"
              src="https://www.youtube-nocookie.com/embed/PzUU_rcLurQ?modestbranding=1"
              title="SIV Demo video"
            ></iframe>
          </div>
        </main>
        <Footer />
      </div>
      <style jsx>{`
        .page {
          width: 100%;
          overflow-x: hidden;
          padding: 1rem 2rem;
          padding-top: 0 !important;
        }
        main {
          max-width: 1050px;
          width: 100%;
          margin: 6rem auto 10rem;
        }
        .video-container {
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
