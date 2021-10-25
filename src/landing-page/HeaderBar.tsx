import Link from 'next/link'

export const HeaderBar = (): JSX.Element => (
  <div>
    <span>Secure Internet Voting</span>
    <Link href="/admin">
      <a>For Governments</a>
    </Link>
    <style jsx>{`
      div {
        color: #fff;
        font-size: calc(1.2vw + 1rem);
        font-weight: 700;

        cursor: default;

        display: flex;

        justify-content: space-between;
        width: 100%;

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
        background: none;
        border: 1px solid #fff;
        border-radius: 0.4rem;
        color: #fff;
        display: inline-block;
        font-weight: bold;
        font-size: 16px;
        padding: 0.7rem 1.2rem;
        width: 175px;
        text-decoration: none;
        transition: 0.1s background-color linear, 0.1s color linear;
      }

      a:hover {
        background-color: #fff;
        color: #000;
        cursor: pointer;
      }

      @media (max-width: 480px) {
        a {
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
