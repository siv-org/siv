import { EmailSignup } from './EmailSignup'

const email = 'team@secureinternetvoting.org'

export const Footer = (): JSX.Element => (
  <footer>
    <img src="/home3/footer-lines.png" />
    <div>
      <EmailSignup />
    </div>
    <div className="text-align-right">
      <h3>SIV</h3>
      <p>&ldquo;SIV&rdquo;, like civilization</p>
      <p>
        <a href={`mailto:${email}`}>{email}</a>
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
      }

      a {
        color: #000;
        font-weight: bold;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
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
    `}</style>
  </footer>
)
