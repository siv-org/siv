export const HeaderBar = (): JSX.Element => (
  <div>
    Secure Internet Voting
    <style jsx>{`
      div {
        color: #fff;
        font-size: calc(1.2vw + 1rem);
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
    `}</style>
  </div>
)
