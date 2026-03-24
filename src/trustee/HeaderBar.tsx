import Link from 'next/link'

export const HeaderBar = (): JSX.Element => (
  <div className="headerbar-container">
    <div>
      <Link className="text-[24px] font-bold text-white hover:no-underline" href="/">
        SIV
      </Link>
      <Link className="ml-12 text-[16px] text-white max-[480px]:mt-2 max-[480px]:ml-0" href="/protocol">
        Protocol
      </Link>
    </div>
    <style jsx>{`
      .headerbar-container {
        background: rgb(1, 5, 11);
        background: linear-gradient(90deg, #010b26 0%, #072054 100%);

        color: #fff;

        cursor: default;
      }

      .headerbar-container > div {
        max-width: 750px;
        width: 100%;
        margin: 0 auto;
        padding: 1rem;

        display: flex;
        align-items: baseline;
      }

      @media (max-width: 480px) {
        div {
          flex-direction: column;
        }
      }
    `}</style>
  </div>
)
