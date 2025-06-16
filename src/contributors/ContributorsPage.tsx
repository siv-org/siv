import { GlobalCSS } from '../GlobalCSS'
import { Footer } from '../homepage/Footer'
import { HeaderBar } from '../homepage/HeaderBar'
import { Contributors } from './Contributors'

export const ContributorsPage = () => {
  return (
    <div>
      <GlobalCSS />
      <HeaderBar />
      <Contributors />
      <Footer />

      <style jsx>{`
        div {
          padding: 1rem 3rem;
          padding-top: 0 !important;

          width: 100%;
          overflow-x: hidden;
        }

        /* For small screens */
        @media (max-width: 700px) {
          div {
            padding: 1rem 2rem;
          }
        }
      `}</style>
    </div>
  )
}
