import { consultation_link } from './ForGovernments'

export const HeaderBar = (): JSX.Element => (
  <div>
    Secure Internet Voting
    <a href={consultation_link}>For Governments</a>
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

      a {
        margin-left: 3rem;
        color: white;
        font-size: 18px;
        text-decoration: none;
        font-weight: 400;
      }

      a:hover {
        text-decoration: underline;
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
