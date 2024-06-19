import { EmailSignup } from './EmailSignup'

const email = 'team@siv.org'

export const Footer = (): JSX.Element => (
  <footer>
    <img src="/home3/footer-lines.png" />
    <div>
      <EmailSignup />
    </div>
    <div className="text-align-right">
      <h3 className="my-4">SIV</h3>
      <p>&ldquo;SIV&rdquo;, like civilization</p>
      <p>
        <a className="font-semibold text-black" href={`mailto:${email}`}>
          {email}
        </a>
      </p>
    </div>
    <style jsx>{`
      footer {
        padding: 33vw 0 6vw;
        display: flex;
        justify-content: space-between;
        position: relative;
      }

      img {
        z-index: -1;
        position: absolute;
        top: -28vw;
        left: -30vw;
        right: -30vw;
        width: 148vw;
        max-width: unset;
      }

      div:first-child {
        margin-right: 15%;
      }

      h3 {
        font-size: 2.5vw;
      }

      p {
        font-size: 1.625vw;
      }

      .text-align-right {
        text-align: right;
        padding-top: 1rem;
      }

      /* Small screens: single column */
      @media (max-width: 700px) {
        footer {
          flex-direction: column;
        }

        img {
          left: -16vw;
          right: -16vw;
          width: 120vw;
          top: -21vw;
        }

        div:first-child {
          margin: 0;
          margin-bottom: 3rem;
        }

        .text-align-right {
          text-align: left;
        }

        h3 {
          font-size: 6vw;
        }

        p {
          font-size: 4.5vw;
        }
      }

      /* fixed width for large screens */
      @media (min-width: 1440px) {
        footer {
          max-width: 1440px;
          margin: 0 auto;

          padding-top: 35vw;
        }

        img {
          top: -31vw;
        }
      }
    `}</style>
  </footer>
)
