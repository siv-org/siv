import Link from 'next/link'
import { darkBlue } from 'src/homepage3/colors'

export const HeaderBar = (): JSX.Element => (
  <div className="container">
    <div>
      <Link href="/">
        <a>SIV</a>
      </Link>
    </div>
    <style jsx>{`
      .container {
        cursor: default;
      }

      .container > div {
        max-width: 1050px;
        width: 100%;
        margin: 0 auto;
        padding: 1rem;

        display: flex;
        align-items: baseline;
      }

      a {
        font-size: 30px;
        font-weight: 700;
        color: ${darkBlue};
      }

      a:hover {
        text-decoration: none;
      }
    `}</style>
  </div>
)
