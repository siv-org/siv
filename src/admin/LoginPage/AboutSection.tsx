import Link from 'next/link'
import { darkBlue } from 'src/_shared/Button'

import { breakpoint } from './LoginPage'

export const AboutSection = () => {
  return (
    <aside>
      <Link href="/">
        <a>
          <img className="logo" src="/login/circle-logo.png" />
        </a>
      </Link>
      <h3>
        Fast, private, & verifiable <br />
        elections.
      </h3>
      <img className="phone" src="/login/iphone.png" />
      <style jsx>{`
        img.logo {
          display: block;
          width: 70px;
        }

        h3 {
          font-size: 28px;
          color: ${darkBlue};
        }

        img.phone {
          display: block;
          width: 200px;
          position: relative;
          right: 10px;
        }

        @media (max-width: 799px) {
          h3 {
            font-size: 24px;
          }
        }

        @media (max-width: ${breakpoint}px) {
          img.phone {
            display: none;
          }

          aside {
            display: flex;
            flex-direction: column;
            align-items: center;

            margin: 2rem 0;
          }
        }
      `}</style>
    </aside>
  )
}
