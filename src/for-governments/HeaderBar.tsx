import Link from 'next/link'

export const HeaderBar = (): JSX.Element => (
  <div>
    <Link href="/">
      <a>Secure Internet Voting</a>
    </Link>
    <style jsx>{`
      div {
        color: #fff;
        font-size: 28px;
        font-weight: 700;

        cursor: default;

        display: flex;
        align-items: baseline;

        position: absolute;
        top: 0;
        left: 0;

        padding: 2vw 3vw;
      }

      @media (max-width: 800px) {
        div {
          padding: 6vw;
        }
      }

      a {
        color: #fff;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `}</style>
  </div>
)
