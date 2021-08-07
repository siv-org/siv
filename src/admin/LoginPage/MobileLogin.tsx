import { LoginInput } from './LoginInput'
import { breakpoint } from './LoginPage'

export const MobileLogin = () => {
  return (
    <section>
      <div>
        <LoginInput mobile />
      </div>
      <p>— or —</p>
      <style jsx>{`
        section {
          width: 100%;
          position: relative;
        }

        div {
          display: flex;
        }

        p {
          text-align: center;
          font-style: italic;
          opacity: 0.5;
          margin: 2rem 0;
        }

        /* Hide when not mobile */
        @media (min-width: ${breakpoint}px) {
          section {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
