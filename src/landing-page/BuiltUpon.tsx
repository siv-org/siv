import Link from 'next/link'

import { JumboBlue } from './JumboBlue'

export const BuiltUpon = (): JSX.Element => (
  <JumboBlue>
    <h2>
      Built upon decades of research and hard work by uncountable contributors in academia, industry, and the public
      sector.{' '}
      <Link href="/about">
        <a>Learn more</a>
      </Link>
    </h2>

    <style jsx>{`
      p {
        font-size: calc(0.72vw + 1rem);
      }

      a {
        font-size: 17px;
        font-style: italic;
        color: white;
        font-weight: 400;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      @media (min-width: 750px) {
        h2,
        p {
          padding: 17px;
          text-align: center;
          width: 100%;
        }
      }
    `}</style>
  </JumboBlue>
)
