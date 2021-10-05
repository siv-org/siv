import Link from 'next/link'

import { Button } from '../landing-page/Button'

export const TransparentProtocol = (): JSX.Element => (
  <div>
    <h2>
      SIV&apos;s transparent protocol helps you give citizens the option to vote with far stronger{' '}
      <Link href="/faq#secure">
        <a>security</a>
      </Link>{' '}
      &amp;{' '}
      <Link href="/faq#privacy">
        <a>privacy</a>
      </Link>{' '}
      than paper methods.
    </h2>
    <Button href="/protocol">See an interactive explanation of how SIV works</Button>

    <style jsx>{`
      div {
        padding: 30px 30px 60px;
        text-align: center;
        max-width: 1240px;
        margin: 0 auto;
      }

      a {
        color: black;
        font-style: italic;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `}</style>
  </div>
)
