import Link from 'next/link'
import { darkBlue } from 'src/homepage/colors'

export const Headerbar = () => (
  <header>
    <h3>
      <Link href="/">
        <a className="logo">SIV</a>
      </Link>
    </h3>

    <style jsx>{`
      header {
        padding-top: 2vw;
        text-align: center;
      }

      h3 {
        margin: 0;
        font-size: 3vw;
      }

      h3 a:hover {
        text-decoration: none;
      }

      a {
        color: ${darkBlue};
      }

      @media (max-width: 700px) {
        h3 {
          font-size: 6.5vw;
        }
      }
    `}</style>
  </header>
)
