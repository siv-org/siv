import Link from 'next/link'

export const Headerbar = () => (
  <header>
    <h3>
      <Link className="text-[#050068] hover:no-underline" href="/">
        SIV
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

      @media (max-width: 700px) {
        h3 {
          font-size: 6.5vw;
        }
      }
    `}</style>
  </header>
)
