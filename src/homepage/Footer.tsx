import { EmailSignup } from './EmailSignup'

const email = 'team@siv.org'

export const Footer = (): JSX.Element => (
  <footer className="pt-[33vw] pb-[6vw] flex justify-between relative">
    <img
      className="z-[-1] absolute top-[-28vw] left-[-30vw] right-[-30vw] w-[148vw] max-w- max-w-[unset]"
      src="/home3/footer-lines.png"
    />
    <div>
      <EmailSignup />
    </div>
    <div className="pt-4 text-align-right">
      <h3 className="my-4 text-[2.5vw]">SIV</h3>
      <p className="text-[1.625vw]">&ldquo;SIV&rdquo;, like civilization</p>
      <p className="text-[1.625vw]">
        <a className="font-semibold text-black" href={`mailto:${email}`}>
          {email}
        </a>
      </p>
    </div>
    <style jsx>{`
      .text-align-right {
        text-align: right;
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
