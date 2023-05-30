import Link from 'next/link'

export const HeaderBar = (): JSX.Element => (
  <div className="bg-gradient-to-r p-4 from-[#010b26] to-[#072054] text-white">
    <div className="max-w-[750px] w-full mx-auto">
      <Link href="/">
        <a className="big">Secure Internet Voting</a>
      </Link>
    </div>
    <style jsx>{`
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
