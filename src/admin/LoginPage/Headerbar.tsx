import Link from 'next/link'

import { LoginInput } from './LoginInput'
import { breakpoint } from './LoginPage'

export const Headerbar = ({ hideLogin }: { hideLogin?: boolean }) => {
  return (
    <header>
      <div>
        <h2>
          <Link href="/" legacyBehavior>
            <a>Secure Internet Voting</a>
          </Link>
        </h2>
        {!hideLogin && (
          <section>
            <LoginInput />
          </section>
        )}
      </div>
      <style jsx>{`
        header {
          background: rgb(1, 5, 11);
          background: linear-gradient(90deg, #010b26 0%, #072054 100%);

          color: #fff;
          width: 100%;

          padding: 0 3vw;

          z-index: 100;
          position: relative;

          display: flex;
          justify-content: center;
        }

        div {
          display: flex;
          justify-content: space-between;
          flex: 1;
          max-width: 1000px;
        }

        h2 {
          white-space: nowrap;
          margin-right: 2rem;
        }

        h2 a {
          color: white;
        }

        section {
          max-width: 410px;
          flex: 1;
          display: flex;
          position: relative;
        }

        @media (max-width: ${breakpoint}px) {
          div {
            justify-content: center;
          }

          h2 {
            margin-right: 0;
          }

          section {
            display: none;
          }
        }
      `}</style>
    </header>
  )
}
