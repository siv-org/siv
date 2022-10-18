import Link from 'next/link'

export const HeaderBar = (): JSX.Element => (
  <div className="headerbar">
    <div>
      <Link href="/">
        <a className="big">Secure Internet Voting</a>
      </Link>
      <Link href="/protocol">
        <a>Protocol</a>
      </Link>
    </div>
    <style jsx>{`
      .headerbar {
        background: rgb(1, 5, 11);
        background: linear-gradient(90deg, #010b26 0%, #072054 100%);

        color: #fff;

        cursor: default;
      }

      .headerbar > div {
        max-width: 750px;
        width: 100%;
        margin: 0 auto;
        padding: 1rem;

        display: flex;
        align-items: baseline;
      }

      .big {
        font-size: 24px;
        font-weight: 700;
        color: white;
      }

      a:not(:first-child) {
        margin-left: 3rem;
        color: white;
        font-size: 16px;
        text-decoration: none;
        font-weight: 400;
      }

      a:hover {
        text-decoration: underline;
      }

      a.big:hover {
        text-decoration: none;
      }

      @media (max-width: 480px) {
        a:not(:first-child) {
          margin-left: 0;
          margin-top: 0.5rem;
        }

        div {
          flex-direction: column;
        }
      }
    `}</style>
  </div>
)
