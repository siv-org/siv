import Link from 'next/link'

export const HeaderBar = (): JSX.Element => (
  <div className="container">
    <div>
      <Link href="/">
        <a>Secure Internet Voting</a>
      </Link>
    </div>
    <style jsx>{`
      .container {
        background: rgb(1, 5, 11);
        background: linear-gradient(90deg, #010b26 0%, #072054 100%);

        color: #fff;

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
        font-size: 24px;
        font-weight: 700;
        color: white;
      }

      a:hover {
        text-decoration: none;
      }
    `}</style>
  </div>
)
